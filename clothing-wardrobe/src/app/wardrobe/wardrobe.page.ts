// src/app/wardrobe/wardrobe.page.ts
import { Component, OnInit } from '@angular/core';
import { DexieService, ClothingItem } from '../DexieService';
import { ModalController } from '@ionic/angular';
import {AddClothingItemComponent} from "../components/add-clothing-item/add-clothing-item.component";

@Component({
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.page.html',
  styleUrls: ['./wardrobe.page.scss'],
})
export class WardrobePage implements OnInit {
  clothingItems: ClothingItem[] = [];

  constructor(
    private dexieService: DexieService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.loadClothingItems();
  }

  async loadClothingItems() {
    this.clothingItems = await this.dexieService.getAllClothingItems();
  }

  async openAddModal() {
    // 打开添加衣物的模态窗口
    const modal = await this.modalController.create({
      component: AddClothingItemComponent as any,
    });
    modal.onDidDismiss().then(() => {
      this.loadClothingItems();
    });
    return await modal.present();
  }

  async deleteItem(id: any) {
    await this.dexieService.deleteClothingItem(id);
    this.loadClothingItems();
  }
}
