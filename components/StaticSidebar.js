import tw from "../utils/tailwind";
import Log from "./Log";
import { Store } from "../contexts/Store";

export default function StaticSidebar() {
  const Logs = Store((state) => state.Logs);

  return (
    <div className={tw("hidden md:flex md:flex-shrink-0")}>
      <div className="flex flex-col w-64">
        {/* <!-- Sidebar component, swap this element with another sidebar if you like --> */}
        <div className="flex flex-col h-0 flex-1">
          <div
            className={tw(
              "flex items-center h-16 flex-shrink-0 px-4",
              "bg-gray-900"
            )}
          >
            <h1 className="text-center text-white text-3xl font-bold">
              &#x1F47B; Alert Global
            </h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
              {Logs.map((log) => (
                <Log
                  key={log.logId}
                  logId={log.logId}
                  lat={log.lat}
                  lng={log.lng}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
