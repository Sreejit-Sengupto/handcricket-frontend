import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/join-room.tsx"),
  route("stadium/:roomId", "routes/room/index.tsx"),
] satisfies RouteConfig;
