import {Component} from '@angular/core';
import {DexieService, ClothingItem} from '../../DexieService';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-add-clothing-item',
  templateUrl: './add-clothing-item.component.html',
  styleUrls: ['./add-clothing-item.component.scss'],
})
export class AddClothingItemComponent {
  newItem: ClothingItem = {name: '', type: '春秋装', color: '', size: '', image: '', created: ''};

  constructor(
    private dexieService: DexieService,
    private modalController: ModalController
  ) {
  }

  async addClothingItem() {
    if (!this.newItem.name || !this.newItem.image) {
      alert('请输入名称并选择图片');
      return;
    }
    this.newItem.created
    await this.dexieService.addClothingItem(this.newItem);
    await this.modalController.dismiss();
  }

  closeModal() {
    this.modalController.dismiss().then();
  }

  dateFn(data: any) {
    this.newItem.created = data.detail.value
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const base64Image = e.target.result;
        // 压缩图片
        this.newItem.image = <string>await this.compressImage(base64Image, 0.5);
      };
      reader.readAsDataURL(file);
    }
  }

  // 使用 Canvas 压缩图片
  async compressImage(base64Image: string, quality: number): Promise<unknown> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // 设置画布尺寸
        const maxWidth = 600; // 设置最大宽度
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        // 将图片绘制到 Canvas 上
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 进行压缩，生成新的 Base64 字符串
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
    });
  }
  onIonChange(event: CustomEvent) {
    this.newItem.type = event.detail.value;
  }

  onDidDismiss(event: CustomEvent) {
    console.log('didDismiss', JSON.stringify(event.detail.value));
  }
}
