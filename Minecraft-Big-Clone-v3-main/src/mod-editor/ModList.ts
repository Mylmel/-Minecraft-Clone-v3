import { ModManager } from './ModManager';

export function showModList() {
    // Remove existing mod list container if present
    const existingContainer = document.getElementById('mod-list-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const modListContainer = document.createElement('div');
    modListContainer.id = 'mod-list-container';
    modListContainer.className = 'mod-list-container';
    
    // Styling for the mod list container
    modListContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #333;
        border: 2px solid #555;
        padding: 20px;
        z-index: 1000;
        min-width: 400px;
        max-height: 70vh;
        overflow-y: auto;
    `;
    
    document.body.appendChild(modListContainer);
    
    // Populate the mod list
    renderModList(modListContainer);
}

function renderModList(container: HTMLElement) {
    const mods = ModManager.getInstance().getAllMods();
    
    container.innerHTML = '';
    
    const title = document.createElement('h3');
    title.textContent = 'Installed Mods';
    title.style.color = 'white';
    title.style.marginBottom = '15px';
    container.appendChild(title);
    
    if (mods.length === 0) {
        const noMods = document.createElement('p');
        noMods.textContent = 'No mods installed';
        noMods.style.color = 'white';
        container.appendChild(noMods);
    } else {
        const modList = document.createElement('ul');
        modList.style.listStyle = 'none';
        modList.style.padding = '0';
        modList.style.margin = '0';
        
        mods.forEach(mod => {
            const listItem = document.createElement('li');
            listItem.style.cssText = `
                background-color: #444;
                margin-bottom: 8px;
                padding: 10px;
                border-radius: 4px;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const modInfo = document.createElement('div');
            modInfo.innerHTML = `
                <strong>${mod.name}</strong><br>
                <small>Version: ${mod.version} | Author: ${mod.author}</small>
            `;
            
            const modActions = document.createElement('div');
            
            const toggleButton = document.createElement('button');
            toggleButton.textContent = mod.enabled ? 'Disable' : 'Enable';
            toggleButton.style.marginRight = '10px';
            toggleButton.onclick = () => {
                ModManager.getInstance().toggleMod(mod.id);
                renderModList(container); // Refresh the list
            };
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = '#aa0000';
            deleteButton.onclick = () => {
                if (confirm(`Are you sure you want to delete mod "${mod.name}"?`)) {
                    ModManager.getInstance().removeMod(mod.id);
                    renderModList(container); // Refresh the list
                }
            };
            
            modActions.appendChild(toggleButton);
            modActions.appendChild(deleteButton);
            
            listItem.appendChild(modInfo);
            listItem.appendChild(modActions);
            
            modList.appendChild(listItem);
        });
        
        container.appendChild(modList);
    }
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
        margin-top: 15px;
        padding: 8px 16px;
        background-color: #555;
        color: white;
        border: none;
        cursor: pointer;
    `;
    closeButton.onclick = hideModList;
    
    container.appendChild(closeButton);
}

export function hideModList() {
    const modListContainer = document.getElementById('mod-list-container');
    if (modListContainer) {
        modListContainer.remove();
    }
    
    // Show pause menu again
    const pauseMenu = document.getElementById('pause-menu');
    if (pauseMenu) {
        pauseMenu.style.display = 'flex';
    }
}