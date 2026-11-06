require('dotenv').config();

const BASE_URL = (process.env.BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

if (!username) {
  throw new Error('TEST_USERNAME must be set in the environment or .env file.');
}

if (!password) {
  throw new Error('TEST_PASSWORD must be set in the environment or .env file.');
}

module.exports = {
  urls: {
    loginPage: `${BASE_URL}/accounts/signin/`,
    dashboardPage: `${BASE_URL}/calendar/calendar/view/`,
    AddDebts: `${BASE_URL}/debt/add/`,
    AddEvent: `${BASE_URL}/calendar/event/create/`,
    AddPatient: `${BASE_URL}/customer/add/`,
    AddPayment: `${BASE_URL}/payments/add/`,
    AddTreatment: `${BASE_URL}/treatment/create/`,
    CatalogCourse: `${BASE_URL}/catalogs/courses/`,
    catalogExamination: `${BASE_URL}/catalogs/examinations/`,
    CatalogTreatment: `${BASE_URL}/catalogs/treatments/`,
    CreateCatalogCourses: `${BASE_URL}/catalogs/courses/create/`,
    CreateCatalogTreatments: `${BASE_URL}/catalogs/treatments/create/`,
    CreateDoctor: `${BASE_URL}/doctors/add/`,
    CreateExaminationPage: `${BASE_URL}/catalogs/examinations/create/`,
    CreateMedicine: `${BASE_URL}/medicine/add/`,
    CreatePackage: `${BASE_URL}/package/create/`,
    CreatePatientPackage: `${BASE_URL}/package/patient-packages/create/`,
    CreateRoom: `${BASE_URL}/calendar/room/create/`,
    CreateStockPage: `${BASE_URL}/stocks/items/create/`,
    CreateStockMovement: `${BASE_URL}/stocks/movements/create/`,
    CreateStockSupplier: `${BASE_URL}/stocks/suppliers/create/`,
    CreateTransactionCategory: `${BASE_URL}/tcategories/add/`,
    CreateTransactions: `${BASE_URL}/debit/add/`,
    DebtsPage: `${BASE_URL}/debt/`,
    DoctorsPage: `${BASE_URL}/doctors/list/`,
    EditPersonalInfo: `${BASE_URL}/accounts/me/edit/`,
    EventPage: `${BASE_URL}/calendar/event/list/`,
    Medicine: `${BASE_URL}/medicine/list/`,
    PackagePage: `${BASE_URL}/package/`,
    PatientPackagePage: `${BASE_URL}/package/patient-packages/`,
    PatientPage: `${BASE_URL}/customer/list/`,
    Payments: `${BASE_URL}/payments/list/`,
    PersonalInfo: `${BASE_URL}/accounts/me/view/`,
    RoomsPage: `${BASE_URL}/calendar/room/list/`,
    StockMovementPage: `${BASE_URL}/stocks/movements/`,
    StockPage: `${BASE_URL}/stocks/items/`,
    StockSuppliers: `${BASE_URL}/stocks/suppliers/`,
    TransactionCategoryPage: `${BASE_URL}/tcategories/list/`,
    TransactionsPage: `${BASE_URL}/debit/list/`,
    Treatments: `${BASE_URL}/treatment/list/`,
  },
  credentials: {
    email: username,
    password,
  },
};
