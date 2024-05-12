import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

function Layout({ children }) {
  return (
    <div>
      {/* Mobile Navbar hidden on desktop  */}
      <div className=" lg:hidden">
        <Navbar />
      </div>

      <div class="max-h-screen flex ">
        {/* Sidebar hidden on mobile  */}
        <nav class=" w-72 flex-none ... hidden md:block">
          <Sidebar />
        </nav>

        {/* main content  */}
        <main class="flex-1 min-w-0 overflow-auto ...">
          <div className=" flex  justify-center">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
