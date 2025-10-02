class Storage {
    constructor() {
      this.storage = localStorage;
    }
  
    set(key, value) {
      try {
        const serializedValue = JSON.stringify(value);
        this.storage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
      }
    }
  
    get(key) {
      try {
        const storedValue = this.storage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null;
      }
    }

    clearAll() {
        try {

            const keys = Object.keys(this.storage);
            
            keys.forEach(key => {
                this.storage.removeItem(key);
            });
            
            console.log('Все данные успешно удалены из localStorage');
        } catch (error) {
            console.error('Ошибка при очистке localStorage:', error);
        }
    }

    clearKeys(...keys) {
        try {
            if (!keys || keys.length === 0) {
                console.warn('Не указаны ключи для удаления');
                return;
            }
        
            keys.forEach(key => {
                if (this.storage.getItem(key)) {
                    this.storage.removeItem(key);
                    console.log(`Ключ ${key} успешно удален`);
                } else {
                    console.warn(`Ключ ${key} не найден`);
                }
            });
        } catch (error) {
            console.error('Ошибка при удалении ключей:', error);
        }
    }

  }

  export const storage = new Storage()