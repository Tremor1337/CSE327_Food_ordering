CSE327 Food Ordering System

The application represents a complete web-based platform that was developed through CSE327 Software Engineering course requirements. The application functions as an actual food ordering platform by presenting different user interfaces that match the roles of Admins, Owners, Customers and Delivery staff to show implementation of 7 classic design patterns.


Technologies Used
The front-end component of this web application runs on React.js with custom CSS design implementations.

Backend: Node.js with Express.js
Database: SQLite
Authentication: JWT-based login and role-based access control
Version Control: Git & GitHub

---


Role-based login: Admin, Owner, Customer, Delivery
Users with proper authorization can access specific dashboards because of React ProtectedRoute integration.


View, modify, and delete users
Change user roles
The system produces logs for viewing through Singleton Logger.
Uses Singleton and Proxy patterns

Users benefit from functions to view and maintain restaurant information
Add, edit, delete menu items
Uses Factory and Singleton patterns


Users select payment options after adding items from the available menu.
Customers can place orders while checking their past directives and tracking their shipment status through receiving delivery ETAs.
The patterns employed by this system are Strategy together with Facade as well as Adapter and Observer.

Delivery Dashboard
View all orders
Update delivery status for each
The application displays real-time updates which appear on the customer dashboard screen.

Design Patterns Implemented

| Pattern        | Usage                                                            |
|----------------|------------------------------------------------------------------|
| Factory        | User creation at signup (`UserFactory`)                          |
| Singleton      | Centralized logging (`Logger`)                                   |
| Proxy          | Admin access control (`AdminProxy`)                              |
| Strategy       | Payment methods include Cash together with PayPal and Credit Card|
| Adapter        | External delivery ETA formatting (`ETAServiceAdapter`)           |
| Observer       | Order status notifications for customer                          |
| Facade         | Streamlined order process (`OrderFacade`)                        |

---

Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/Tremor1337/CSE327_Food_ordering.git
   cd CSE327_Food_ordering
   ```

2. Backend Setup
   ```bash
   cd backend
   npm install
   node app.js
   ```

3.Frontend Setup
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. Access the App
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

 Folder Structure

```
CSE327_Food_ordering/
├── backend/
│   ├── app.js
│   ├── database/
│   ├── routes/
│   ├── middleware/
│   └── patterns/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.css
```

Screenshots (Optional)
You should add screenshots which belong in the '/screenshots' directory and link them from this place.


License

Besides its educational purpose the project serves under the CSE327 Software Engineering course.