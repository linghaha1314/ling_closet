import { Component } from '@angular/core';
import { DexieService, ClothingItem } from '../../DexieService';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-clothing-item',
  templateUrl: './add-clothing-item.component.html',
  styleUrls: ['./add-clothing-item.component.scss'],
})
export class AddClothingItemComponent {
  newItem: ClothingItem = { name: '', type: '', color: '', size: '', image: '', created: '' };

  constructor(
    private dexieService: DexieService,
    private modalController: ModalController
  ) {}

  async addClothingItem() {
    this.newItem.created
    await this.dexieService.addClothingItem(this.newItem);
    this.modalController.dismiss();
  }

  closeModal() {
    this.modalController.dismiss();
  }
  dateFn(data: any){
    this.newItem.created = data.detail.value
  }
}
