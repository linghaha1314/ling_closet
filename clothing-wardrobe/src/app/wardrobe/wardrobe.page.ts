// src/app/wardrobe/wardrobe.page.ts
import {Component, OnInit} from '@angular/core';
import {ClothingItem, DexieService} from '../DexieService';
import {ModalController} from '@ionic/angular';
import {AddClothingItemComponent} from "../components/add-clothing-item/add-clothing-item.component";
import {EditClothingItemComponent} from '../components/edit-clothing-item/edit-clothing-item.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-wardrobe',
  templateUrl: './wardrobe.page.html',
  styleUrls: ['./wardrobe.page.scss'],
})
export class WardrobePage implements OnInit {
  clothingItems: ClothingItem[] = [];
  upData: ClothingItem[] = [];
  defaultImage = 'assets/icon/logo.png';
  isModalOpen = false;
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
  async openEditModal(clothingItem: ClothingItem) {
    const modal = await this.modalController.create({
      component: EditClothingItemComponent as any,
      componentProps: {clothingItem: { ...clothingItem }},
    });
    modal.onDidDismiss().then(() => {
      this.loadClothingItems();
    });
    return await modal.present();
  }
  async deleteItem(id: any) {
    await this.dexieService.deleteClothingItem(id);
    await this.loadClothingItems();
  }
  // 处理图片加载错误，设置默认图片
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage; // 设置默认图片路径
  }

  // 导出为 Excel 文件
  exportToExcel() {
    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(this.clothingItems);
    // 创建工作簿并将工作表添加到其中
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ClothingItems');
    // 导出为 Excel 文件
    XLSX.writeFile(workbook, 'wardrobe.xlsx');
  }
  // 从 Excel 文件导入数据
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // 获取第一个工作表
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // 将工作表的数据转换为 JSON
      this.upData = <ClothingItem[]>XLSX.utils.sheet_to_json(ws)
      console.log(this.upData,888)
      this.isModalOpen = true
      // 保存到数据库
      // this.saveImportedData(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 保存导入的数据到 Dexie 数据库
  async saveImportedData() {
    const resetButton = document.getElementById('resetButton');
    for (const item of this.upData) {
      await this.dexieService.addClothingItem(item);
    }
    this.clothingItems = await this.dexieService.getAllClothingItems();
    this.isModalOpen = false
    resetButton?.click();
  }

  onDidDismiss(event: CustomEvent) {
    console.log('didDismiss', JSON.stringify(event.detail.value));
  }
}
