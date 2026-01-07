/**
 * Главный файл для интеграции редактора модов в игру
 */

import { modEditor, openModEditor } from './ModEditor';
import { modManager } from './ModManager';
import { Mod } from './Mod';

// Экспортируем основные компоненты для использования в других частях игры
export { modEditor, modManager, Mod, openModEditor };

// Функция для инициализации редактора модов
export function initializeModEditor(): void {
  modEditor.initializeUI();
  console.log('Mod Editor initialized');
  
  // Добавляем горячую клавишу для открытия редактора модов (например, клавиша M)
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyM' && event.ctrlKey) {
      event.preventDefault();
      const modUI = document.getElementById('mod-editor-ui');
      const toggleButton = document.getElementById('toggle-mod-editor') as HTMLButtonElement;
      
      if (modUI) {
        if (modUI.style.display === 'none') {
          modUI.style.display = 'block';
          if (toggleButton) toggleButton.textContent = 'Скрыть';
        } else {
          modUI.style.display = 'none';
          if (toggleButton) toggleButton.textContent = 'Показать';
        }
      }
    }
  });
  
  console.log('Press Ctrl+M to toggle the mod editor');
}

// Экспортируем типы для удобства
export type { ModBlock, ModItem, ModRecipe, ModEntity } from './Mod';