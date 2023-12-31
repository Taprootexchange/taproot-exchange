import {
  createBrowserRouter,
  Navigate,
  createHashRouter,
} from "react-router-dom";
import Marketplace from "@/pages/Marketplace";
import MarketplaceFavorites from "@/pages/Marketplace/Favorites";
import MarketplaceHot from "@/pages/Marketplace/Hot";
import Wallet from "@/pages/Wallet";
import Explorer from "@/pages/Explorer";
import ExplorerTokenEvents from "@/pages/Explorer/TokenEvents";
import ExplorerMarketEvents from "@/pages/Explorer/MarketEvents";

import MarketplaceDetails from "@/pages/MarketplaceDetails";
import MarketplaceDetailsListing from "@/pages/MarketplaceDetails/Listing";
import MarketplaceDetailsOrderHistory from "@/pages/MarketplaceDetails/OrderHistory";
import MarketplaceDetailsMyOrder from "@/pages/MarketplaceDetails/MyOrder";
import App from "@/App/App";

let routerConfig = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/marketplace/hot" replace />,
      },
      {
        path: "/marketplace",
        element: <Marketplace />,
        children: [
          {
            index: true,
            element: <Navigate to="hot" replace />,
          },
          {
            path: "favorites",
            element: <MarketplaceFavorites />,
          },
          {
            path: "hot",
            element: <MarketplaceHot />,
          },
        ],
      },
      {
        path: "/wallet",
        element: <Wallet />,
      },
      {
        path: "/explorer",
        element: <Explorer />,
        children: [
          {
            index: true,
            element: <Navigate to="token-events" replace />,
          },
          {
            path: "token-events",
            element: <ExplorerTokenEvents />,
          },
          {
            path: "market-events",
            element: <ExplorerMarketEvents />,
          },
        ],
      },
      {
        path: "/marketplace-details",
        element: <MarketplaceDetails />,
        children: [
          {
            path: "listing",
            element: <MarketplaceDetailsListing />,
          },
          {
            path: "order-history",
            element: <MarketplaceDetailsOrderHistory />,
          },
          {
            path: "my-order",
            element: <MarketplaceDetailsMyOrder />,
          },
        ],
      },
    ],
  },
];

const env = process.env.REACT_APP_CURRENT_ENV;
let router = null;
if (env == "production" || env == "test") {
  router = createBrowserRouter(routerConfig);
} else {
  router = createHashRouter(routerConfig);
}
export default router;
