import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DexieService, ClothingItem } from '../../DexieService';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-clothing-item',
  templateUrl: './edit-clothing-item.component.html',
  styleUrls: ['./edit-clothing-item.component.scss'],
})
export class EditClothingItemComponent implements OnInit {

  @Input() clothingItem!: ClothingItem;

  editedItem: any

  constructor(
    private dexieService: DexieService,
    private modalController: ModalController
  ) {
  }
  ngOnInit() {
    this.editedItem = { ...this.clothingItem };
  }
  async editClothingItem() {
    await this.dexieService.clothingItems.update(this.editedItem.id, this.editedItem);
    await this.modalController.dismiss();
  }

  closeModal() {
    this.modalController.dismiss().then();
  }
  dateFn(data: any){
    this.editedItem.created = data.detail.value
  }
}
