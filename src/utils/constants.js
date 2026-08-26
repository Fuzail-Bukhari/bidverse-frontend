export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Vehicles",
  "Furniture",
  "Art",
  "Sports",
  "Other",
];

export const AUCTION_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  ENDED: "ended",
  CANCELLED: "cancelled",
};

export const STATUS_COLORS = {
  scheduled: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  live: "text-red-400 bg-red-400/10 border-red-400/30",
  ended: "text-gray-400 bg-gray-400/10 border-gray-400/30",
  cancelled: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

export const SOCKET_EVENTS = {
  JOIN_AUCTION: "join_auction",
  LEAVE_AUCTION: "leave_auction",
  JOIN_USER_ROOM: "join_user_room",
  NEW_BID: "new_bid",
  AUCTION_ENDED: "auction_ended",
  OUTBID: "outbid",
};