# edge-water-markets

# Real-Time Trading Dashboard

A real-time trading dashboard built with React and TypeScript, integrating with the Coinbase Pro WebSocket API to monitor and display live trade data. The dashboard allows users to subscribe and unsubscribe from cryptocurrency products, view real-time prices, track trade matches, and check system status.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Running the Project](#running-the-project)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Subscription Management**: Users can subscribe or unsubscribe to specific cryptocurrency pairs (e.g., BTC-USD, ETH-USD).
- **Real-Time Price View**: Live price data is displayed for subscribed products.
- **Match View**: Detailed match view showing trades with timestamp, product, size, and price.
- **System Status**: Displays the system status based on active subscriptions.

## Technologies Used

- **Frontend**: React (with TypeScript for type safety)
- **WebSocket**: Used for real-time data streaming from Coinbase Pro
- **Backend**: Node.js and Express
- **Authentication**: JWT (JSON Web Token) for secure data transmission
- **Docker**: Containerized environment setup

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahul1992rto/edge-water-markets.git
2. **Install dependencies:**:
   npm i
3. **Usage: React**:
    npm start  
4. **Usage: TypeScript**:
    npx tsc
    npx dist/index.js    
