// src/app/services/dexie.service.ts
import {Injectable} from '@angular/core';
import Dexie, {Table} from 'dexie';

export interface ClothingItem {
  id?: number;
  name: string;
  type: string;  // 如“上衣”、“裤子”、“配饰”
  color: string;
  size: string;
  image: string; // 用于存储图片路径或 Base64
}

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  clothingItems!: Table<ClothingItem, number>;

  constructor() {
    super('ClothingDatabase');
    this.version(1).stores({
      clothingItems: '++id, name, type, color, size'
    });
  }

// 添加新衣物
  async addClothingItem(item: ClothingItem) {
    return await this.clothingItems.add(item);
  }

// 获取所有衣物
  async getAllClothingItems() {
    return await this.clothingItems.toArray();
  }

// 删除衣物
  async deleteClothingItem(id: number) {
    return await this.clothingItems.delete(id);
  }
}
