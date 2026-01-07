/**
 * Класс, представляющий мод для игры Minecraft Clone
 */
export interface ModBlock {
  id: number;
  name: string;
  texture: string;
  hardness: number;
  toolRequired: string;
  dropId: number;
  dropCount: number;
}

export interface ModItem {
  id: number;
  name: string;
  texture: string;
  maxStack: number;
}

export interface ModRecipe {
  type: 'crafting' | 'smelting';
  input: { id: number; count: number } | { id: number; count: number }[];
  output: { id: number; count: number };
  craftingTable?: boolean; // Только для крафта
}

export interface ModEntity {
  id: number;
  name: string;
  model: string;
  health: number;
  speed: number;
}

export class Mod {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  
  blocks: ModBlock[];
  items: ModItem[];
  recipes: ModRecipe[];
  entities: ModEntity[];

  constructor(id: string, name: string, version: string, author: string, description: string) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.author = author;
    this.description = description;
    
    this.blocks = [];
    this.items = [];
    this.recipes = [];
    this.entities = [];
  }

  /**
   * Добавляет новый блок в мод
   */
  addBlock(id: number, name: string, texture: string, hardness: number = 1, toolRequired: string = 'none', dropId: number = id, dropCount: number = 1): void {
    const block: ModBlock = {
      id,
      name,
      texture,
      hardness,
      toolRequired,
      dropId,
      dropCount
    };
    this.blocks.push(block);
  }

  /**
   * Добавляет новый предмет в мод
   */
  addItem(id: number, name: string, texture: string, maxStack: number = 64): void {
    const item: ModItem = {
      id,
      name,
      texture,
      maxStack
    };
    this.items.push(item);
  }

  /**
   * Добавляет новый рецепт в мод
   */
  addRecipe(type: 'crafting' | 'smelting', input: { id: number; count: number } | { id: number; count: number }[], output: { id: number; count: number }, craftingTable: boolean = false): void {
    const recipe: ModRecipe = {
      type,
      input,
      output,
      craftingTable
    };
    this.recipes.push(recipe);
  }

  /**
   * Добавляет новую сущность в мод
   */
  addEntity(id: number, name: string, model: string, health: number, speed: number): void {
    const entity: ModEntity = {
      id,
      name,
      model,
      health,
      speed
    };
    this.entities.push(entity);
  }
}