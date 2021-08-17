let db;
let budgetVersion;


const request = window.indexedDB.open('BudgetDB', budgetVersion || 21);

request.onupgradeneeded = event => {
  console.log('Upgrade needed in IndexDB');

  const { oldVersion } = event;
  const newVersion = event.newVersion || db.version;

  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = event.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('BudgetData', { autoIncrement: true });
  }
};

function checkDatabase() {
  console.log('checking db');

  let transaction = db.transaction(['BudgetData'], 'readwrite');

  const store = transaction.objectStore('BudgetData');

  const getAll = store.getAll();
    console.log(getAll)
  getAll.onsuccess = function () {
    
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => {
          
          if (res.length !== 0) {
           
            transaction = db.transaction(['BudgetData'], 'readwrite');

            const currentStore = transaction.objectStore('BudgetData');

            currentStore.clear();
            console.log('Clearing store 🧹');
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  console.log('success');
  db = e.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

const saveRecord = (record) => {
  console.log('Saving record');
  const transaction = db.transaction(['BudgetData'], 'readwrite');

  const store = transaction.objectStore('BudgetData');

  store.add(record);
};

window.addEventListener('online', checkDatabase);
