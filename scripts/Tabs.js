
//? Шаг 1.
// Находим все Tabs на странице которые  находиться внутри элемента:
// с атрибутом data-js-tabs
const rootSelector = '[data-js-tabs]';

class Tabs {
    selectors = {
        root: rootSelector,
        button: '[data-js-tabs-button]',
        content: '[data-js-tabs-content]',
    };

    stateClasses = {
        isActive: 'is-active',
    };

    stateAttributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex',
    };

    // ? Шаг 4. Запускается constructor Tabs и Сохраняем корневой элемент :  this.rootElement = rootElement;
    constructor(rootElement) {
        this.rootElement = rootElement;

        // ? Шаг 5. Находим кнопки
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button); // Находим кнопки

        //? Шаг 6. Находим контент
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content); // Находим контент

        //? Шаг 7. Создаём состояние:
        this.state = {
            activeTabIndex: [...this.buttonElements] // Создаём состояние
                .findIndex((buttonElement) =>
                    buttonElement.classList.contains(this.stateClasses.isActive) // ищет индекс кнопки с классом: isActive.
                )
        };

        // ? Шаг 8. Сохраняем последний индекс:
        this.limitTabsIndex = this.buttonElements.length - 1; //Сохраняем последний индекс.

        //? Шаг 9. Подписываемся на события:
        this.bindEvents(); //Подписываемся на события.

    };




    // ? Шаг 14. updateUI() Получаем состояние:
    updateUI() {
        // Получаем состояние:
        const { activeTabIndex } = this.state;

        // ?  Шаг 15. Обновляем кнопки:
        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex;


            buttonElement.classList.toggle(
                this.stateClasses.isActive,
                isActive
            );

            buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString());
            buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1');

        });

        // ? Шаг 16. Обновляем контент:
        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex;

            contentElement.classList.toggle(
                this.stateClasses.isActive,
                isActive
            );
        });
    };

    //!   Методы клавиш  переключения на клавиатуре: =========================
    // Вспомогательная функциа для методов клавиш :
    activateTab(newTabIndex) {
        this.state.activeTabIndex = newTabIndex;
        this.buttonElements[newTabIndex].focus();
    }

    previousTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
            ? this.limitTabsIndex
            : this.state.activeTabIndex - 1;

        this.activateTab(newTabIndex);

    };
    nextTab = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
            ? 0
            : this.state.activeTabIndex + 1;

        this.activateTab(newTabIndex);
    };

    firstTab = () => {
        this.activateTab(0);
    };

    lastTab = () => {
        this.activateTab(this.limitTabsIndex);
    };

    //!========================================================================

    //? Шаг 11. Пользователь нажал кнопку:
    onButtonClick(buttonIndex) {
        console.log(buttonIndex);

        // ? Шаг 12. Меняем состояние:
        //НЕ переключаешь классы напрямую , Сначала меняешь состояние:
        this.state.activeTabIndex = buttonIndex;

        // ? Шаг 13. Обновляем интерфейс
        this.updateUI();
    };

    onKeyDown = (event) => {
        const { code, metaKey } = event

        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTab,
            Home: this.firstTab,
            End: this.lastTab,
        }[code];

        const isMacHomeKey = metaKey && code === 'ArrowLeft';
        if (isMacHomeKey) {
            this.firstTab();
            this.updateUI();
            return
        }
        const isMacEndKey = metaKey && code === 'ArrowRight';
        if (isMacEndKey) {
            this.lastTab();
            this.updateUI();
            return
        }

        action?.(); //  эта строчка означает: «Если в переменной action есть функция, то выполни её. Если там пусто (undefined), то ничего не делай и не выдавай ошибку».
        this.updateUI();
    }
    // ? Шаг 10. bindEvents() Перебираем все кнопки:
    bindEvents() {
        // Навешиваем обработчик: Логика:
        //Если нажали кнопку
        // ↓
        //Передай её индекс
        //↓
        //Запусти onButtonClick
        this.buttonElements.forEach((buttonElement, index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        });
        this.rootElement.addEventListener('keydown', this.onKeyDown);
    };
}

//? Шаг 2. Создаётся TabsCollection и инициализируется в моем случии в главном файле:  main.js:   new TabsCollection();
// ? Шаг 3.   Инициализация всех компонентов -----------
class TabsCollection {
    constructor() {
        this.init()
    };

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => new Tabs(element))
    };
}

export default TabsCollection