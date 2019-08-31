/**
 *  CalorieDrive - Track your calories
 * @author Amir Salih (Techwalia)
 * @version 1.0.0
 * @license MIT
 * 
 */

 //Storage Controller

 const StorageCtrl = (function(){

    //public methods
    return {
        storeItem: function(item){
            let items = [];
            //check if any iterms in LS
            if(localStorage.getItem("items") === null) {
                items.push(item);
                //set LS
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));
                //push new item
                items.push(item);
                //re set LS
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach(function(item, index){
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem("items", JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        },
        getItemsFromStorage: function(){
            let items = [];
            if(localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        }
    }
 })();

 //Item Controller
const ItemCtrl = (function(){
    //console.log("item controller");
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / state
    const data = {
        // items: [
        //     {id: 0, name: "Adana Kebab", calories: 300},
        //     {id: 1, name: "Chicken Kebab", calories: 200},
        //     {id: 2, name: "Iskender", calories: 400},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            //CreateID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            //calories to number
            calories = parseInt(calories);
            //create new item
            const newItem = new Item(ID, name, calories);

            //add item to data structure
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function() {
            let total = 0;
            //loop through items and calculate total
            data.items.forEach(function(item){
                total += item.calories;
            });
            //set total cal in the data structure
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItemById: function(id) {
            let found = null;
            //loop through all items and return when id is matched
            data.items.forEach(function(item){
                if(item.id === id)
                    found = item;
            });
            return found;
        },
        updateItem: function(name, calories) {
            //calories to number
            calories = parseInt(calories);

            let found = null
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            //get Ids
            ids = data.items.map(function(item){
                return item.id;
            });

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        logData: function(){
            return data;
        }
    }
})();

 //UI Controller
 const UICtrl = (function(){
     //UI elements selectors
     const UISelectors = {
         itemList: '#item-list',
         listItems: '#item-list li',
         addBtn: '.add-btn',
         updateBtn: '.update-btn',
         deleteBtn: '.delete-btn',
         backBtn: '.back-btn',
         clearBtn: '.clear-btn',
         itemNameInput: '#item-name',
         itemCaloriesInput: '#item-calories',
         totalCalories: '.total-calories'
     }
    
    //public methods
    return {
        populateItemList: function(items){
            let html = ``;

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`;
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            //add class to li
            li.className = 'collection-item';
            //add ID
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
            //add li to item list
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            //convert NodeList returned into array
            listItems = Array.from(listItems);
            //loop through item lists and update the one returned
            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`) {
                    document.querySelector(`#item-${item.id}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                                                                        <a href="#" class="secondary-content">
                                                                            <i class="edit-item fa fa-pencil"></i>
                                                                        </a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemtoForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //convert NodeList into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            //clear inputs
            UICtrl.clearInput();
            //hide edit, delete & back button are hidden
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            //hide edit, delete & back button are hidden
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }

    }
})();

 //App Controller
 const App = (function(ItemCtrl, UICtrl, StorageCtrl){
     //clear edit state
     UICtrl.clearEditState();

     //Load event listeners
     const loadEventListeners = function(){
        //get UISelectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        
        //disable submit on enter
        document.addEventListener("keypress", function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        
        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        
        //Update item submit event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete item submit event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //clear all button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
     }

     //Add item submit
     const itemAddSubmit = function(e){
        //get form input from UIController
        const input = UICtrl.getItemInput();
        
        //check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            //Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //store in localStorage
            StorageCtrl.storeItem(newItem);

            //Clear input fields
            UICtrl.clearInput();
            
        }
        e.preventDefault();
    }

    //Item edit click
    const itemEditClick = function(e){
        //event delegation to get dynamically generated edit button
        if(e.target.classList.contains('edit-item')){
            // Get list item id
            const itemId = e.target.parentNode.parentNode.id;
            
            //break into an array
            const itemIdArray = itemId.split('-');
            //get actual id 
            const id = parseInt(itemIdArray[1]);
            
            //get item from data
            const itemEdit = ItemCtrl.getItemById(id);

            //set current item (for edit)
            ItemCtrl.setCurrentItem(itemEdit);

            //add item to form (for edit)
            UICtrl.addItemtoForm();

        }
        e.preventDefault();
    }

    const itemUpdateSubmit = function(e){
        //get item input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        
        //Update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    
    //delete button submmit
    const itemDeleteSubmit = function(e){
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //clear items
    const clearAllItemsClick = function(){
        //delete all ite from data structure
        ItemCtrl.clearAllItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //update UI
        UICtrl.removeItems();

        //clear from local storage
        StorageCtrl.clearItemsFromStorage();

        //hide list
        UICtrl.hideList();
    }

    //public methods
    return {
        init: function(){
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items are there
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with the fetched items
                UICtrl.populateItemList(items);

            }
            
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            //Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

//Intialize app
App.init();