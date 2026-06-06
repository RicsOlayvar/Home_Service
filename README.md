# Tandikan Services Booking System

## Overview

Tandikan Services Booking System is a web-based service booking platform that allows customers to book household services such as cleaning, plumbing, electrical work, gardening, painting, appliance repair, aircon cleaning, and carpentry. The system includes separate modules for Customers, Workers, and Administrators.

The platform streamlines service requests, worker assignments, booking management, and job tracking through a centralized dashboard.

---

## Features

### Customer Features

* User Registration and Login
* Service Booking
* View Booking History
* Real-time Service Pricing
* View Booking Status
* View Payment Status
* Apply as Worker

### Worker Features

* Worker Login
* View Assigned Jobs
* Complete Assigned Jobs
* Cancel Assigned Jobs
* View Worker Dashboard
* Track Job Statistics
* View Job History

### Administrator Features

* Admin Login
* Dashboard Overview
* Manage Bookings
* Search and Filter Bookings
* Assign Workers to Bookings
* Update Payment Status
* Update Booking Status
* Manage Worker Applications
* Approve or Reject Worker Applications
* Manage Workers
* Add New Workers
* Edit Worker Information
* Delete Workers
* Manage Worker Availability
* View Customer Locations Using Maps

---

## Services Offered

1. Cleaning
2. Plumbing
3. Electrical
4. Gardening
5. Painting
6. Appliance Repair
7. Aircon Cleaning
8. Carpentry

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Storage

* Browser LocalStorage

### Mapping

* Leaflet.js
* OpenStreetMap

---

## User Roles

### Customer

Customers can:

* Create an account
* Login
* Book services
* View booking history
* Apply as a worker

### Worker

Workers can:

* Login using worker credentials
* View assigned jobs
* Complete jobs
* Cancel jobs
* Monitor work performance

### Administrator

Administrators can:

* Manage all bookings
* Manage workers
* Approve worker applications
* Assign workers to bookings
* Monitor system activity

---

## Project Structure

TandikanServices/

├── homepage/

│   ├── view.html

│   ├── style.css

│

├── Authentication/

│   ├── login.html

│   ├── signup.html

│   ├── auth.js

│   ├── auth-ui.js

│

├── Bookings/

│   ├── booking.html

│   ├── booking.js

│

├── History/

│   ├── history.html

│

├── Worker/

│   ├── worker-login.html

│   ├── worker-dashboard.html

│   ├── worker-dashboard.js

│   ├── manage-workers.html

│   ├── manage-workers.js

│

├── Admin/

│   ├── admin.html

│   ├── admin.js

│

├── WorkerApplication/

│   ├── apply-worker.html

│

└── assets/

---

## Installation Guide

### Step 1

Download or clone the project files.

### Step 2

Open the project folder in Visual Studio Code.

### Step 3

Install the Live Server extension.

### Step 4

Right-click view.html.

### Step 5

Select "Open with Live Server".

### Step 6

The application will open in your browser.

---

## Default System Flow

### Customer Flow

1. Register Account
2. Login
3. Book a Service
4. View Booking History
5. Track Booking Status

### Worker Flow

1. Submit Worker Application
2. Wait for Admin Approval
3. Login as Worker
4. View Assigned Jobs
5. Complete Assigned Jobs

### Admin Flow

1. Login as Admin
2. Review Worker Applications
3. Approve Workers
4. Manage Bookings
5. Assign Workers
6. Monitor Dashboard

---

## Future Improvements

* Database Integration
* Online Payment Gateway
* Email Notifications
* SMS Notifications
* Worker Rating System
* Customer Reviews
* Analytics Dashboard
* PDF Report Generation
* Cloud Deployment

---

## Project Status

Current Completion: Approximately 95%

The system is fully functional and suitable for academic demonstrations, project presentations, and prototype deployment.

---

## Developers

Developed as part of an academic project for service booking and workforce management.
