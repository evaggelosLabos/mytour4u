# Corfu Transfers – Backend API

This repository contains the backend API for **CorfuTransfersApp**
(https://corfutransfersapp.com), a real-world transfer booking platform
used by tourism businesses in Corfu.

The backend handles booking requests️ requests, admin workflows, and
email notifications.

## What this project does
- Handles transfer booking submissions
- Manages booking data and status updates
- Sends automated email notifications
- Exposes REST APIs consumed by a Next.js frontend
- Designed for real production usage

## Tech Stack
- Node.js
- Express
- MongoDB
- REST API architecture
- Deployed on Render / Azure (adjust if needed)

## Architecture Highlights
- Clean API routing
- Separation of controllers and services
- MongoDB data models for bookings
- Environment-based configuration

## Context
This is **production backend code** powering a live platform:
👉 https://corfutransfersapp.com

Some sensitive logic (keys, credentials) is excluded for security reasons.

## Status
Active production project.
