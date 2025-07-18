
import { Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InputCustomEvent, IonModal, Platform, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner, LensFacing, StartScanOptions } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  standalone: false,
})
export class ViewMessagePage implements OnInit {
  public task!: Message;
  private data = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);

  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;

  @ViewChild('video')
  public videoElement: ElementRef<HTMLVideoElement> | undefined;

  @ViewChild('video')
  public openModal: ElementRef | undefined;
  @ViewChild('modal') modal!: IonModal;

  public message!: Message;
  public isTorchAvailable = true;
  public isWeb = Capacitor.getPlatform() === 'web';
  public minZoomRatio: number | undefined;
  public maxZoomRatio: number | undefined;
  public allScanned: boolean = false;

  protected isSupported = false;
  protected scanning = false;
  protected scannedBarcode = '';
  protected pickVerifyProcess: Array<string> = [];

  protected binDataSource = binData;
  protected binDisplayedColumns = ['location', 'bin', 'quantity'];

  protected productData = productData;
  protected productDisplayedColumns = ['productInfo', 'quantity', 'scannedQty'];

  constructor(
    private readonly ngZone: NgZone,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
  ) {}
    
  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.task = this.data.getMessageById(parseInt(id, 10));
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  ionViewDidEnter(){
    this.productData.forEach(e=>e.scanned = false);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios')
    return 'verify';
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  public setZoomRatio(event: InputCustomEvent): void {
    if (!event.detail.value) {
      return;
    }
    BarcodeScanner.setZoomRatio({
      zoomRatio: parseInt(event.detail.value as any, 10),
    });
  }

  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  protected async scan(): Promise<void> {
    this.scanning = true;

    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }

    const options: StartScanOptions = {
      formats: undefined,
      lensFacing: LensFacing.Back,
      videoElement:
        Capacitor.getPlatform() === 'web'
          ? this.videoElement?.nativeElement
          : undefined,
    };

    const squareElementBoundingClientRect = this.squareElement?.nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
          left: squareElementBoundingClientRect.left * window.devicePixelRatio,
          right:
            squareElementBoundingClientRect.right * window.devicePixelRatio,
          top: squareElementBoundingClientRect.top * window.devicePixelRatio,
          bottom:
            squareElementBoundingClientRect.bottom * window.devicePixelRatio,
          width:
            squareElementBoundingClientRect.width * window.devicePixelRatio,
          height:
            squareElementBoundingClientRect.height * window.devicePixelRatio,
        }
      : undefined;
    const detectionCornerPoints = scaledRect
      ? [
          [scaledRect.left, scaledRect.top],
          [scaledRect.left + scaledRect.width, scaledRect.top],
          [
            scaledRect.left + scaledRect.width,
            scaledRect.top + scaledRect.height,
          ],
          [scaledRect.left, scaledRect.top + scaledRect.height],
        ]
      : undefined;

    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async (event) => {
        this.ngZone.run(() => {
          const firstBarcode = event.barcodes[0];
          if (!firstBarcode) {
            return;
          }
          const cornerPoints = firstBarcode.cornerPoints;
          if (
            detectionCornerPoints &&
            cornerPoints &&
            Capacitor.getPlatform() !== 'web'
          ) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          
          if(this.pickVerifyProcess.length >= 1){
            const tbs = this.productData.find(e=>!e.scanned);
            if(tbs) tbs.scanned = true;

            this.allScanned = this.productData.every(e=>e.scanned);
          } else {
            this.pickVerifyProcess.push(firstBarcode.displayValue);
          }

          this.stopScan();
          listener.remove();
        });
      },
    );

    await BarcodeScanner.startScan(options);
      if (Capacitor.getPlatform() !== 'web') {
        void BarcodeScanner.getMinZoomRatio().then((result) => {
          this.minZoomRatio = result.zoomRatio;
        });
        void BarcodeScanner.getMaxZoomRatio().then((result) => {
          this.maxZoomRatio = result.zoomRatio;
        });
    }
  }

  protected async stopScan(): Promise<void> {
    await BarcodeScanner.stopScan();
    this.scanning = false;
  }

  protected binScan(): void {
    this.pickVerifyProcess = [];
    this.scan();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Pick Verified Successfully.',
      duration: 3000,
      position: position,
      color: "success",
    });
    this.router.navigate(['/verify']);
    await toast.present();

    setTimeout(()=>{
      this.data.messages.pop();
    }, 1000)
  }
}

const binData = [
  {
    location: 'WH1-001',
    bin: 'B1-001',
    quantity: (Math.random() * 100).toFixed(),
  },
  {
    location: 'WH1-002',
    bin: 'B1-002',
    quantity: (Math.random() * 100).toFixed(),
  },
  {
    location: 'WH1-003',
    bin: 'B1-003',
    quantity: (Math.random() * 100).toFixed(),
  },
  {
    location: 'WH1-004',
    bin: 'B1-004',
    quantity: (Math.random() * 100).toFixed(),
  },
  {
    location: 'WH1-005',
    bin: 'B1-005',
    quantity: (Math.random() * 100).toFixed(),
  },
  {
    location: 'WH1-006',
    bin: 'B1-006',
    quantity: (Math.random() * 100).toFixed(),
  }
];

const productData = [
  {
    imageUrl: 'assets/product-images/intel.jpg',
    productCode: 'ELE-PRO-030',
    productTitle: 'Intel Core i7-12700K Desktop Processor',
    quantity: (Math.random() * 100).toFixed(),
    scanned: false
  },
  {
    imageUrl: 'assets/product-images/ice-cream.jpg',
    productCode: 'FNB-DRY-020',
    productTitle: 'Kwality Walls Cadbury Crackle Ice Creams',
    quantity: (Math.random() * 100).toFixed(),
    scanned: false
  },
  {
    imageUrl: 'assets/product-images/banana.jpg',
    productCode: 'FOD-ITM-010',
    productTitle: 'X-2000 Banana Slicer',
    quantity: (Math.random() * 100).toFixed(),
    scanned: false
  },
  {
    imageUrl: 'assets/product-images/nintendo.jpg',
    productCode: 'NIN-DO-010',
    productTitle: 'Nintendo Switch 2',
    quantity: 1,
    scanned: false
  }
]