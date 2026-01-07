/**
 * Пример создания мода с использованием редактора модов
 */

import { modEditor } from './index';

// Создаем пример мода с новыми блоками, предметами и рецептами
function createExampleMod(): void {
  console.log('Creating example mod...');
  
  // Создаем новый мод
  const exampleMod = modEditor.createNewMod(
    'example-mod',
    'Примерный Мод',
    '1.0.0',
    'Developer',
    'Это пример мода с новыми блоками и предметами'
  );
  
  // Добавляем новые блоки
  const diamondBlockId = modEditor.addBlockToCurrentMod(
    'Алмазный Блок',
    'diamond_texture.png',
    5, // высокая прочность
    'stone_pickaxe', // требует каменную кирку
    100, // выпадает сам себя
    1
  );
  
  const goldBlockId = modEditor.addBlockToCurrentMod(
    'Золотой Блок',
    'gold_texture.png',
    3, // средняя прочность
    'stone_pickaxe',
    101,
    1
  );
  
  // Добавляем новые предметы
  const diamondId = modEditor.addItemToCurrentMod(
    'Алмаз',
    'diamond_item.png',
    64
  );
  
  const goldenAppleId = modEditor.addItemToCurrentMod(
    'Золотое Яблоко',
    'golden_apple.png',
    16
  );
  
  // Добавляем рецепты
  // Рецепт: 9 алмазов -> алмазный блок
  modEditor.addRecipeToCurrentMod(
    'crafting',
    [
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 },
      { id: diamondId, count: 1 }
    ],
    { id: diamondBlockId, count: 1 },
    true // требуется верстак
  );
  
  // Рецепт: золотые блоки -> золотое яблоко
  modEditor.addRecipeToCurrentMod(
    'crafting',
    [
      { id: goldBlockId, count: 1 },
      { id: 7, count: 1 } // используем обычное яблоко (если есть)
    ],
    { id: goldenAppleId, count: 1 },
    true
  );
  
  console.log('Example mod created with IDs:', {
    diamondBlock: diamondBlockId,
    goldBlock: goldBlockId,
    diamond: diamondId,
    goldenApple: goldenAppleId
  });
  
  // Сохраняем мод в менеджер модов
  const success = modEditor.saveCurrentMod();
  if (success) {
    console.log('Example mod saved to mod manager!');
  } else {
    console.error('Failed to save example mod');
  }
}

// Экспортируем функцию для возможного вызова извне
export { createExampleMod };

// Автоматически создаем пример мода при загрузке, если нужно
// createExampleMod();