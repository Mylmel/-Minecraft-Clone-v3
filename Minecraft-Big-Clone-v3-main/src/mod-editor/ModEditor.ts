import { Mod } from './Mod';
import type { ModBlock, ModItem, ModRecipe, ModEntity } from './Mod';
import { modManager } from './ModManager';

/**
 * Класс редактора модов для игры Minecraft Clone
 * Позволяет создавать, редактировать и управлять модами
 */
export class ModEditor {
  private currentMod: Mod | null;
  private modUI: any; // UI компонент, будет инициализирован позже

  constructor() {
    this.currentMod = null;
  }

  /**
   * Создает новый мод
   */
  createNewMod(id: string, name: string, version: string, author: string, description: string): Mod {
    this.currentMod = new Mod(id, name, version, author, description);
    console.log(`New mod created: ${name}`);
    return this.currentMod;
  }

  /**
   * Загружает мод из JSON
   */
  loadModFromJSON(jsonString: string): Mod | null {
    try {
      const modData = JSON.parse(jsonString);
      
      const mod = new Mod(
        modData.id,
        modData.name,
        modData.version,
        modData.author,
        modData.description
      );

      // Загружаем блоки
      if (modData.blocks) {
        for (const block of modData.blocks) {
          mod.addBlock(
            block.id,
            block.name,
            block.texture,
            block.hardness,
            block.toolRequired,
            block.dropId,
            block.dropCount
          );
        }
      }

      // Загружаем предметы
      if (modData.items) {
        for (const item of modData.items) {
          mod.addItem(
            item.id,
            item.name,
            item.texture,
            item.maxStack
          );
        }
      }

      // Загружаем рецепты
      if (modData.recipes) {
        for (const recipe of modData.recipes) {
          mod.addRecipe(
            recipe.type,
            recipe.input,
            recipe.output,
            recipe.craftingTable
          );
        }
      }

      // Загружаем сущности
      if (modData.entities) {
        for (const entity of modData.entities) {
          mod.addEntity(
            entity.id,
            entity.name,
            entity.model,
            entity.health,
            entity.speed
          );
        }
      }

      this.currentMod = mod;
      console.log(`Mod loaded from JSON: ${mod.name}`);
      return mod;
    } catch (error) {
      console.error('Error loading mod from JSON:', error);
      return null;
    }
  }

  /**
   * Экспортирует текущий мод в JSON
   */
  exportModToJSON(): string | null {
    if (!this.currentMod) {
      console.warn('No mod to export');
      return null;
    }

    const modData = {
      id: this.currentMod.id,
      name: this.currentMod.name,
      version: this.currentMod.version,
      author: this.currentMod.author,
      description: this.currentMod.description,
      blocks: this.currentMod.blocks,
      items: this.currentMod.items,
      recipes: this.currentMod.recipes,
      entities: this.currentMod.entities
    };

    return JSON.stringify(modData, null, 2);
  }

  /**
   * Добавляет блок в текущий мод
   */
  addBlockToCurrentMod(name: string, texture: string, hardness: number = 1, toolRequired: string = 'none', dropId?: number, dropCount: number = 1): number {
    if (!this.currentMod) {
      console.warn('No current mod. Create or load a mod first.');
      return -1;
    }

    const id = modManager.getNextBlockId();
    const actualDropId = dropId !== undefined ? dropId : id;
    
    this.currentMod.addBlock(id, name, texture, hardness, toolRequired, actualDropId, dropCount);
    console.log(`Block added to mod: ${name} (ID: ${id})`);
    
    return id;
  }

  /**
   * Добавляет предмет в текущий мод
   */
  addItemToCurrentMod(name: string, texture: string, maxStack: number = 64): number {
    if (!this.currentMod) {
      console.warn('No current mod. Create or load a mod first.');
      return -1;
    }

    const id = modManager.getNextItemId();
    this.currentMod.addItem(id, name, texture, maxStack);
    console.log(`Item added to mod: ${name} (ID: ${id})`);
    
    return id;
  }

  /**
   * Добавляет рецепт в текущий мод
   */
  addRecipeToCurrentMod(type: 'crafting' | 'smelting', input: { id: number; count: number } | { id: number; count: number }[], output: { id: number; count: number }, craftingTable: boolean = false): void {
    if (!this.currentMod) {
      console.warn('No current mod. Create or load a mod first.');
      return;
    }

    this.currentMod.addRecipe(type, input, output, craftingTable);
    console.log(`Recipe added to mod: ${type} recipe`);
  }

  /**
   * Добавляет сущность в текущий мод
   */
  addEntityToCurrentMod(name: string, model: string, health: number, speed: number): number {
    if (!this.currentMod) {
      console.warn('No current mod. Create or load a mod first.');
      return -1;
    }

    const id = modManager.getNextEntityId();
    this.currentMod.addEntity(id, name, model, health, speed);
    console.log(`Entity added to mod: ${name} (ID: ${id})`);
    
    return id;
  }

  /**
   * Устанавливает текущий мод
   */
  setCurrentMod(mod: Mod): void {
    this.currentMod = mod;
  }

  /**
   * Получает текущий мод
   */
  getCurrentMod(): Mod | null {
    return this.currentMod;
  }

  /**
   * Сохраняет текущий мод в менеджер модов
   */
  saveCurrentMod(): boolean {
    if (!this.currentMod) {
      console.warn('No current mod to save');
      return false;
    }

    return modManager.loadMod(this.currentMod);
  }

  /**
   * Очищает текущий мод
   */
  clearCurrentMod(): void {
    this.currentMod = null;
    console.log('Current mod cleared');
  }

  /**
   * Инициализирует UI редактора модов
   */
  initializeUI(): void {
    // Создаем UI элементы для редактора модов
    this.createModEditorUI();
  }

  /**
   * Создает UI для редактора модов
   */
  private createModEditorUI(): void {
    // Создаем контейнер для UI редактора модов
    const editorContainer = document.createElement('div');
    editorContainer.id = 'mod-editor-container';
    editorContainer.style.display = 'none'; // Скрыто по умолчанию
    editorContainer.innerHTML = `
      <div id="mod-editor-ui" style="position: fixed; top: 10px; left: 10px; width: 400px; max-height: 80vh; overflow-y: auto; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 10px; z-index: 1000; font-family: Arial, sans-serif;">
        <h3>Редактор модов</h3>
        <button id="toggle-mod-editor" style="margin-bottom: 10px; padding: 5px 10px;">Скрыть</button>
        
        <div id="mod-info">
          <h4>Информация о моде</h4>
          <input type="text" id="mod-id" placeholder="ID мода" style="width: 100%; margin-bottom: 5px; padding: 5px;">
          <input type="text" id="mod-name" placeholder="Название мода" style="width: 100%; margin-bottom: 5px; padding: 5px;">
          <input type="text" id="mod-version" placeholder="Версия" value="1.0.0" style="width: 100%; margin-bottom: 5px; padding: 5px;">
          <input type="text" id="mod-author" placeholder="Автор" style="width: 100%; margin-bottom: 5px; padding: 5px;">
          <textarea id="mod-description" placeholder="Описание мода" style="width: 100%; height: 80px; margin-bottom: 10px; padding: 5px;"></textarea>
          <button id="create-mod" style="margin-right: 10px; padding: 5px 10px;">Создать мод</button>
          <button id="load-mod-json" style="margin-right: 10px; padding: 5px 10px;">Загрузить JSON</button>
          <button id="export-mod-json" style="margin-right: 10px; padding: 5px 10px;">Экспорт JSON</button>
          <button id="save-mod" style="padding: 5px 10px;">Сохранить мод</button>
        </div>
        
        <div id="mod-content" style="margin-top: 15px; display: none;">
          <h4>Содержимое мода</h4>
          <div style="margin-bottom: 15px;">
            <h5>Добавить блок</h5>
            <input type="text" id="block-name" placeholder="Название блока" style="width: 70%; margin-right: 5px; padding: 5px;">
            <input type="text" id="block-texture" placeholder="Текстура" style="width: 70%; margin-right: 5px; padding: 5px;">
            <input type="number" id="block-hardness" placeholder="Твердость" value="1" style="width: 30%; margin-right: 5px; padding: 5px;">
            <button id="add-block" style="padding: 5px 10px;">Добавить блок</button>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h5>Добавить предмет</h5>
            <input type="text" id="item-name" placeholder="Название предмета" style="width: 70%; margin-right: 5px; padding: 5px;">
            <input type="text" id="item-texture" placeholder="Текстура" style="width: 70%; margin-right: 5px; padding: 5px;">
            <input type="number" id="item-stack" placeholder="Макс. стак" value="64" style="width: 30%; margin-right: 5px; padding: 5px;">
            <button id="add-item" style="padding: 5px 10px;">Добавить предмет</button>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h5>Добавить рецепт</h5>
            <select id="recipe-type" style="width: 40%; margin-right: 5px; padding: 5px;">
              <option value="crafting">Крафтинг</option>
              <option value="smelting">Выплавка</option>
            </select>
            <input type="text" id="recipe-input" placeholder="Вход (ID,количество)" style="width: 45%; margin-right: 5px; padding: 5px;">
            <input type="text" id="recipe-output" placeholder="Выход (ID,количество)" style="width: 45%; margin-right: 5px; padding: 5px;">
            <button id="add-recipe" style="padding: 5px 10px;">Добавить рецепт</button>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h5>Добавить сущность</h5>
            <input type="text" id="entity-name" placeholder="Название сущности" style="width: 70%; margin-right: 5px; padding: 5px;">
            <input type="text" id="entity-model" placeholder="Модель" style="width: 70%; margin-right: 5px; padding: 5px;">
            <input type="number" id="entity-health" placeholder="Здоровье" value="20" style="width: 30%; margin-right: 5px; padding: 5px;">
            <input type="number" id="entity-speed" placeholder="Скорость" value="1" style="width: 30%; margin-right: 5px; padding: 5px;">
            <button id="add-entity" style="padding: 5px 10px;">Добавить сущность</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(editorContainer);
    
    // Привязываем события
    this.bindModEditorEvents();
  }

  /**
   * Привязывает события к элементам UI
   */
  private bindModEditorEvents(): void {
    const toggleButton = document.getElementById('toggle-mod-editor') as HTMLButtonElement;
    const modContainer = document.getElementById('mod-editor-ui') as HTMLDivElement;
    
    toggleButton?.addEventListener('click', () => {
      if (modContainer.style.display === 'none') {
        modContainer.style.display = 'block';
        toggleButton.textContent = 'Скрыть';
      } else {
        modContainer.style.display = 'none';
        toggleButton.textContent = 'Показать';
      }
    });
    
    // Обработчики для создания мода
    const createModButton = document.getElementById('create-mod') as HTMLButtonElement;
    createModButton?.addEventListener('click', () => {
      const modId = (document.getElementById('mod-id') as HTMLInputElement).value;
      const modName = (document.getElementById('mod-name') as HTMLInputElement).value;
      const modVersion = (document.getElementById('mod-version') as HTMLInputElement).value;
      const modAuthor = (document.getElementById('mod-author') as HTMLInputElement).value;
      const modDescription = (document.getElementById('mod-description') as HTMLTextAreaElement).value;
      
      if (modId && modName) {
        this.createNewMod(modId, modName, modVersion, modAuthor, modDescription);
        (document.getElementById('mod-content') as HTMLDivElement).style.display = 'block';
        alert(`Мод "${modName}" создан!`);
      } else {
        alert('Пожалуйста, заполните обязательные поля: ID и Название');
      }
    });
    
    // Обработчики для загрузки/экспорта JSON
    const loadJsonButton = document.getElementById('load-mod-json') as HTMLButtonElement;
    loadJsonButton?.addEventListener('click', () => {
      const jsonInput = prompt('Введите JSON мода:');
      if (jsonInput) {
        const mod = this.loadModFromJSON(jsonInput);
        if (mod) {
          (document.getElementById('mod-content') as HTMLDivElement).style.display = 'block';
          (document.getElementById('mod-id') as HTMLInputElement).value = mod.id;
          (document.getElementById('mod-name') as HTMLInputElement).value = mod.name;
          (document.getElementById('mod-version') as HTMLInputElement).value = mod.version;
          (document.getElementById('mod-author') as HTMLInputElement).value = mod.author;
          (document.getElementById('mod-description') as HTMLTextAreaElement).value = mod.description;
          alert(`Мод "${mod.name}" загружен!`);
        } else {
          alert('Ошибка при загрузке мода из JSON');
        }
      }
    });
    
    const exportJsonButton = document.getElementById('export-mod-json') as HTMLButtonElement;
    exportJsonButton?.addEventListener('click', () => {
      const json = this.exportModToJSON();
      if (json) {
        prompt('JSON мода (скопируйте):', json);
      } else {
        alert('Нет мода для экспорта');
      }
    });
    
    // Обработчик сохранения мода
    const saveModButton = document.getElementById('save-mod') as HTMLButtonElement;
    saveModButton?.addEventListener('click', () => {
      if (this.saveCurrentMod()) {
        alert('Мод успешно сохранен в менеджер модов!');
      } else {
        alert('Ошибка при сохранении мода');
      }
    });
    
    // Обработчики для добавления блока
    const addBlockButton = document.getElementById('add-block') as HTMLButtonElement;
    addBlockButton?.addEventListener('click', () => {
      const blockName = (document.getElementById('block-name') as HTMLInputElement).value;
      const blockTexture = (document.getElementById('block-texture') as HTMLInputElement).value;
      const blockHardness = parseFloat((document.getElementById('block-hardness') as HTMLInputElement).value) || 1;
      
      if (blockName) {
        const id = this.addBlockToCurrentMod(blockName, blockTexture, blockHardness);
        if (id !== -1) {
          alert(`Блок "${blockName}" добавлен с ID: ${id}`);
          (document.getElementById('block-name') as HTMLInputElement).value = '';
          (document.getElementById('block-texture') as HTMLInputElement).value = '';
          (document.getElementById('block-hardness') as HTMLInputElement).value = '1';
        }
      } else {
        alert('Пожалуйста, укажите название блока');
      }
    });
    
    // Обработчики для добавления предмета
    const addItemButton = document.getElementById('add-item') as HTMLButtonElement;
    addItemButton?.addEventListener('click', () => {
      const itemName = (document.getElementById('item-name') as HTMLInputElement).value;
      const itemTexture = (document.getElementById('item-texture') as HTMLInputElement).value;
      const itemStack = parseInt((document.getElementById('item-stack') as HTMLInputElement).value) || 64;
      
      if (itemName) {
        const id = this.addItemToCurrentMod(itemName, itemTexture, itemStack);
        if (id !== -1) {
          alert(`Предмет "${itemName}" добавлен с ID: ${id}`);
          (document.getElementById('item-name') as HTMLInputElement).value = '';
          (document.getElementById('item-texture') as HTMLInputElement).value = '';
          (document.getElementById('item-stack') as HTMLInputElement).value = '64';
        }
      } else {
        alert('Пожалуйста, укажите название предмета');
      }
    });
    
    // Обработчики для добавления рецепта
    const addRecipeButton = document.getElementById('add-recipe') as HTMLButtonElement;
    addRecipeButton?.addEventListener('click', () => {
      const recipeType = (document.getElementById('recipe-type') as HTMLSelectElement).value as 'crafting' | 'smelting';
      const recipeInput = (document.getElementById('recipe-input') as HTMLInputElement).value;
      const recipeOutput = (document.getElementById('recipe-output') as HTMLInputElement).value;
      
      try {
        // Парсим вход и выход
        const inputParts = recipeInput.split(',').map(part => part.trim());
        const outputParts = recipeOutput.split(',').map(part => part.trim());
        
        if (inputParts.length >= 2 && outputParts.length >= 2) {
          const inputId = parseInt(inputParts[0]);
          const inputCount = parseInt(inputParts[1]);
          const outputId = parseInt(outputParts[0]);
          const outputCount = parseInt(outputParts[1]);
          
          if (!isNaN(inputId) && !isNaN(inputCount) && !isNaN(outputId) && !isNaN(outputCount)) {
            const input = { id: inputId, count: inputCount };
            const output = { id: outputId, count: outputCount };
            
            this.addRecipeToCurrentMod(recipeType, input, output);
            alert(`Рецепт ${recipeType} добавлен`);
            (document.getElementById('recipe-input') as HTMLInputElement).value = '';
            (document.getElementById('recipe-output') as HTMLInputElement).value = '';
          } else {
            alert('Неверный формат ID или количества');
          }
        } else {
          alert('Пожалуйста, укажите вход и выход в формате: ID,количество');
        }
      } catch (e) {
        alert('Ошибка при добавлении рецепта: ' + (e as Error).message);
      }
    });
    
    // Обработчики для добавления сущности
    const addEntityButton = document.getElementById('add-entity') as HTMLButtonElement;
    addEntityButton?.addEventListener('click', () => {
      const entityName = (document.getElementById('entity-name') as HTMLInputElement).value;
      const entityModel = (document.getElementById('entity-model') as HTMLInputElement).value;
      const entityHealth = parseInt((document.getElementById('entity-health') as HTMLInputElement).value) || 20;
      const entitySpeed = parseFloat((document.getElementById('entity-speed') as HTMLInputElement).value) || 1;
      
      if (entityName && entityModel) {
        const id = this.addEntityToCurrentMod(entityName, entityModel, entityHealth, entitySpeed);
        if (id !== -1) {
          alert(`Сущность "${entityName}" добавлена с ID: ${id}`);
          (document.getElementById('entity-name') as HTMLInputElement).value = '';
          (document.getElementById('entity-model') as HTMLInputElement).value = '';
          (document.getElementById('entity-health') as HTMLInputElement).value = '20';
          (document.getElementById('entity-speed') as HTMLInputElement).value = '1';
        }
      } else {
        alert('Пожалуйста, укажите название и модель сущности');
      }
    });
  }
}

// Глобальный экземпляр редактора модов
export const modEditor = new ModEditor();