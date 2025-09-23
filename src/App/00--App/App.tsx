
import { Outlet, Link, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from "date-fns/locale";
import { useState, forwardRef, useEffect } from "react";
import "./App.css";



function App() {

  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // start at yesterday

    const day = today.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 6) {
      // Saturday → move back 1 more day (to Friday)
      today.setDate(today.getDate() - 1);
    } else if (day === 0) {
      // Sunday → move back 2 more days (to Friday)
      today.setDate(today.getDate() - 2);
    }

    return today;
  });
  type VegReport = {
    results: VegResult[];
  };

  type VegResult = {
    market_location_city: string;
    commodity: string;
    item_size: string;
    pkg: string;
    low_price: string;
    high_price: string;
  };



  const [vegReports, setVegReports] = useState<VegReport[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation().pathname;





  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };



  const CustomInput = forwardRef<HTMLInputElement, { value: string; onClick: () => void }>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ value, onClick }, _ref) => (
      <div
        className="relative border-2 border-green-700 text-center rounded-[0.675rem] py-[0.25rem] px-[2.75rem] cursor-pointer"
        onClick={onClick}
      >
        <span>{value || "Select a date"}</span>
        <div className="arrow-down" />
      </div>
    )
  );

  useEffect(() => {
    const fetchReports = async () => {
      if (!date) return;

      const formatted = formatDate(date);

      // 🔹 Check localStorage first
      const cached = localStorage.getItem(`vegReports-${formatted}`);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        // only use if cache is recent enough (e.g. < 24h old)
        if (Date.now() - ts < 1000 * 60 * 60 * 24) {
          setVegReports(data);
          return; // ✅ don’t hit API
        }
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://single-instance.tb-technologies.ca/vegibecusda?date=${formatted}`
        );
        const data = await res.json();
        setVegReports(data.reports || []);

        // 🔹 Save to cache
        localStorage.setItem(
          `vegReports-${formatted}`,
          JSON.stringify({ data: data.reports || [], ts: Date.now() })
        );
      } catch (err) {
        console.error("Failed to fetch veg reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [date]);

  useEffect(() => {
    console.log(vegReports);
  }, [vegReports]);


  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center gap-[1rem] font-[nunito]">

      <div className="w-full text-[1.25rem] mt-[1rem] flex gap-[1rem] justify-center items-center">
        <Link className={`underline decoration-1 w-[150px] text-center ${location === "/" ? "font-bold text-green-400" : ""}`} to={"/"} >Par points d'expédititions</Link>
        <Link className={`underline decoration-1 w-[150px] text-center ${location === "/variete" ? "font-bold text-green-400" : ""}`} to={"/variete"} >Par Variété</Link>
      </div>

      <h1 className="mt-[1rem] text-[1.75rem] text-center leading-[100%]">Sélectionner la date <br /> du rapport</h1>
      <div className=" relative z-100 lg:scale-140 lg:text-[0.9rem]  scale-124 ">
        <DatePicker
          selected={date}
          onChange={(newDate) => newDate && setDate(newDate)}
          locale={fr}
          dateFormat="MM/dd/yyyy"
          className="lg:px-0 border-2 border-green-700 border-solid  rounded-[0.675rem] py-[0.25rem]"
          customInput={<CustomInput value={""} onClick={function (): void {
            throw new Error("Function not implemented.");
          }} />
          }

        />
      </div>


      <Outlet context={{ vegReports, loading }} />
    </div>
  );
}

export default App;
