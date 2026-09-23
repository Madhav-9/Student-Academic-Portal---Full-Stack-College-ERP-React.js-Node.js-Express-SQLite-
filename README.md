# Student-Academic-Portal---Full-Stack-College-ERP-React.js-Node.js-Express-SQLite-
Student Academic Portal - Full-Stack College ERP (React.js, Node.js, Express, SQLite)
Student Academic Portal – Full-Stack College ERP (React.js, Node.js, Express, SQLite) 
Objective 
To develop a complete full-stack Single Page Application (SPA) for managing college student records. The portal supports full CRUD (Create, Read, Update, Delete) operations for students and subjects, recording of marks with automatic grade calculation, subject-wise attendance, document verification, and a dashboard with key statistics. 
Theory 
1. Single Page Application and React.js
In an SPA thebrowser loads one HTML page and JavaScript updates the screen without reloading. React.jsbuilds the user interface from small reusable components. State is stored with the useStatehook and side effects such as loading data from the server are done in useEffect. Dataflows from parent to child through props. 
2. React Router
React Router v6provides client-side routing: the URL changes (for example /students/5) but the page is not reloaded; the matching page component is shown. useParams reads values from the URL and useNavigate changes the page from code. 
3. Vite
Viteisthe build tool for theReactclient.Indevelopment it gives a hot-reloading server on port 5173and forwards every /apirequesttotheExpress server on port 5000 (proxy). The command vitebuild creates an optimisedclient/distfolder. 
4. REST API using Express
The back end exposes RESTendpoints(GET, POST, PUT, DELETE) that receive and return JSON. In production modeExpressserves client/dist as well, so the API and the React application run together onport5000.
5. SQLite relational database
The data is stored in academic.dbineightrelated tables. Foreign keys link every child table to the students or subjects table,andONDELETE CASCADE removes all related records automatically when a studentisdeleted.PRAGMA foreign_keys = ON enables this rule in SQLite. database.js also providesthreepromise-based helpers – runQuery, getQuery and allQuery – so the routes canuseasync/await. 
6. Grade calculation 
Marks are enteredasInternal (outof30) andExternal (outof 70). The server calculates Total = Internal +Externaland assignsaletter gradeusing thefunction computeGrade(). If a mark entry alreadyexistsforthe samestudent andsubject it isupdated instead of duplicated. 
 
Software / Tools Used 
 
 
Project File Structure 
Experiment no 03/
 |-- server.js 	(Express app, all REST API routes) 
	|-- database.js 	(SQLite connection, table creation, query helpers) 
	|-- seed.js 	(inserts sample MITS students, subjects, marks) 
	|-- academic.db 	(SQLite database file) 
	|-- package.json	(server dependencies and npm scripts) 
|-- README.md
|-- client/ 
	|-- index.html 	(root page with <div id="root">) 
	|-- vite.config.js 	(React plugin and /api proxy) 
	|-- package.json 	(client dependencies) 
	|-- dist/ 	(production build served by Express) 
|-- src/ 
	|-- main.jsx 	(entry point, BrowserRouter) 
	|-- App.jsx 	(layout and route table) 
	|-- api.js 	(functions that call the REST API) 
	|-- index.css	(design system and styling) 
|-- components/ 
	| 	|-- Sidebar.jsx, Navbar.jsx, Modal.jsx 
|-- pages/ 
|-- Dashboard.jsx, Students.jsx, StudentDetails.jsx, 
Back-end Files 
	File	Role 
server.js 	Defines all API routes for dashboard statistics, students, subjects, marks, attendance and documents; contains computeGrade(); serves client/dist; seeds the database at start-up 
database.js 	Opens academic.db, enables foreign keys, creates the 8 tables and exports initDatabase, runQuery, getQuery and allQuery 
seed.js 	Fills an empty database with sample students, subjects, family details, marks and attendance so that the portal has data on first run 
Front-end Components and Pages 
 
Front-end Routes 
 
Database Tables 
 
REST API Endpoints 
 
How to Run 
 

Fig. 3.1: Student details – Overview tab

 
 

Fig. 3.2: Student details – Personal / Family / Address tabs 
 
Fig. 3.3: Student details – Attendance tab 
 
Fig. 3.4: Student details – Marks tab and Documents tab 
 
Fig. 3.5: Subjects catalog and add/edit modal 
 
Fig. 3.9: Marks and Grades page Fig. 3.9: Marks and Grades page 
 

Result 
The Student Academic Portal was developed successfully as a full-stack SPA. The React front end communicates with the Express REST API, all student, subject, marks and attendance data is stored in SQLite with foreign-key relations, and the system supports complete CRUD operations, filtering, automatic grade calculation and a statistics dashboard. 
