import { Mod } from './Mod';
import { BLOCK } from '../World';

/**
 * Класс для управления модами в игре
 */
export class ModManager {
  private mods: Map<string, Mod>;
  private nextBlockId: number;
  private nextItemId: number;
  private nextEntityId: number;

  constructor() {
    this.mods = new Map();
    // В оригинальной игре ID блоков начинаются с 1, а инструментов с 20
    // Начнем с 100, чтобы избежать конфликта с оригинальными ID
    this.nextBlockId = 100;
    this.nextItemId = 200;
    this.nextEntityId = 300;
  }

  /**
   * Загружает мод в игру
   */
  loadMod(mod: Mod): boolean {
    if (this.mods.has(mod.id)) {
      console.warn(`Mod with id ${mod.id} already loaded`);
      return false;
    }

    // Проверяем уникальность ID блоков и предметов
    for (const block of mod.blocks) {
      if (this.isIdUsed(block.id)) {
        console.error(`Block ID ${block.id} already in use`);
        return false;
      }
    }

    for (const item of mod.items) {
      if (this.isIdUsed(item.id)) {
        console.error(`Item ID ${item.id} already in use`);
        return false;
      }
    }

    for (const entity of mod.entities) {
      if (this.isIdUsed(entity.id)) {
        console.error(`Entity ID ${entity.id} already in use`);
        return false;
      }
    }

    this.mods.set(mod.id, mod);
    console.log(`Mod ${mod.name} loaded successfully`);
    return true;
  }

  /**
   * Удаляет мод из игры
   */
  unloadMod(modId: string): boolean {
    if (!this.mods.has(modId)) {
      console.warn(`Mod with id ${modId} is not loaded`);
      return false;
    }

    const mod = this.mods.get(modId)!;
    this.mods.delete(modId);
    console.log(`Mod ${mod.name} unloaded successfully`);
    return true;
  }

  /**
   * Проверяет, используется ли ID
   */
  private isIdUsed(id: number): boolean {
    // Проверяем в оригинальных блоках
    if (id in BLOCK) {
      return true;
    }

    // Проверяем в загруженных модах
    for (const mod of this.mods.values()) {
      for (const block of mod.blocks) {
        if (block.id === id) return true;
      }
      for (const item of mod.items) {
        if (item.id === id) return true;
      }
      for (const entity of mod.entities) {
        if (entity.id === id) return true;
      }
    }

    return false;
  }

  /**
   * Получает следующий доступный ID для блока
   */
  getNextBlockId(): number {
    while (this.isIdUsed(this.nextBlockId)) {
      this.nextBlockId++;
    }
    return this.nextBlockId++;
  }

  /**
   * Получает следующий доступный ID для предмета
   */
  getNextItemId(): number {
    while (this.isIdUsed(this.nextItemId)) {
      this.nextItemId++;
    }
    return this.nextItemId++;
  }

  /**
   * Получает следующий доступный ID для сущности
   */
  getNextEntityId(): number {
    while (this.isIdUsed(this.nextEntityId)) {
      this.nextEntityId++;
    }
    return this.nextEntityId++;
  }

  /**
   * Возвращает все загруженные моды
   */
  getAllMods(): Mod[] {
    return Array.from(this.mods.values());
  }

  /**
   * Возвращает мод по ID
   */
  getModById(modId: string): Mod | undefined {
    return this.mods.get(modId);
  }

  /**
   * Получает все блоки из всех модов
   */
  getAllModBlocks(): { [id: number]: string } {
    const blocks: { [id: number]: string } = {};
    
    for (const mod of this.mods.values()) {
      for (const block of mod.blocks) {
        blocks[block.id] = block.name;
      }
    }
    
    return blocks;
  }

  /**
   * Получает все предметы из всех модов
   */
  getAllModItems(): { [id: number]: string } {
    const items: { [id: number]: string } = {};
    
    for (const mod of this.mods.values()) {
      for (const item of mod.items) {
        items[item.id] = item.name;
      }
    }
    
    return items;
  }

  /**
   * Получает все рецепты из всех модов
   */
  getAllModRecipes() {
    const recipes: any[] = [];
    
    for (const mod of this.mods.values()) {
      recipes.push(...mod.recipes);
    }
    
    return recipes;
  }
}

// Создаем глобальный экземпляр менеджера модов
export const modManager = new ModManager();