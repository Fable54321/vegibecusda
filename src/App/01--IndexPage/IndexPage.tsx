import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import loadingImg from '../../assets/loading.png';
import "./IndexPage.css";


function IndexPage() {

    const [veggiesToShow, setVeggiesToShow] = useState<string[]>(["Cabbage", "Squash", "Peppers, Bell Type", "Broccoli", "Cauliflower", "Brussel"]);


    type VegResult = {
        market_location_city: string;
        commodity: string;
        item_size: string;
        pkg: string;
        low_price: string;
        high_price: string;
        report_date: string;
        demand_tone_comments: string;
        supply_tone_comments: string;
        organic: string;
    };

    type outletContextType = {
        vegReports: { results: VegResult[] }[];
        loading: boolean;
    };
    const { vegReports, loading } = useOutletContext<outletContextType>()

    const commodityDisplayName = (commodity: string) => {
        switch (commodity) {
            case "Cabbage":
                return "Chou";
            case "Squash, Zucchini":
                return "Zucchini";
            case "Squash, Yellow Straightneck":
                return "Courgette Jaune";
            case "Peppers, Bell Type":
                return "Poivron";
            case "Broccoli":
                return "Brocoli";
            case "Cauliflower":
                return "Chou-fleur";
            case "Brussels Sprouts":
                return "Choux de Bruxelles";
            default:
                return commodity;
        }
    }

    const commentsTranslation = (comments: string) => {
        switch (comments) {
            case "GOOD":
                return "Bonne";
            case "FAIRLY GOOD":
                return "Plutôt Bonne";
            case "MODERATE":
                return "Modérée";
            case "FAIRLY LIGHT":
                return "Plutôt Faible";
            case "LIGHT":
                return "Faible";
            case "VERY LIGHT":
                return "Très Faible";
            case "Red fairly good, others moderate":
                return "Rouge plutôt bonne, autres modérées";
            case "FAIRLY HEAVY":
                return "Plutôt Forte";
            case "HEAVY":
                return "Forte";
            case "good at slightly lower prices":
                return "bonne pour prix un peu plus faible";
            case "in few hands.":
                return "très limitée";
            default:
                return comments;
        }
    }

    const VeggieCheckbox = ({
        id,
        label,
        value,
    }: {
        id: string;
        label: string;
        value: string;
    }) => {
        const isChecked = veggiesToShow.includes(value);
        const LONG_PRESS_DELAY = 500;
        let pressTimer: ReturnType<typeof setTimeout> | null = null;
        let longPressed = false;

        const handleToggle = (checked: boolean) => {
            setVeggiesToShow(
                checked
                    ? [...veggiesToShow, value]
                    : veggiesToShow.filter((kw) => kw !== value)
            );
        };

        const handleLongPress = () => {
            setVeggiesToShow([value]); // only this one
            longPressed = true;
        };

        const handleMouseDown = () => {
            longPressed = false;
            pressTimer = setTimeout(handleLongPress, LONG_PRESS_DELAY);
        };

        const handleMouseUp = () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
            }
        };

        return (
            <div className="relative flex justify-between">
                <label htmlFor={id}>{label}</label>
                <input
                    id={id}
                    type="checkbox"
                    checked={isChecked}
                    className="accent-green-700 min-w-[1rem] cursor-pointer"
                    onChange={(e) => {
                        // Normal toggle only if it wasn’t a long press
                        if (!longPressed) {
                            handleToggle(e.target.checked);
                        }
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => pressTimer && clearTimeout(pressTimer)}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                />
            </div>
        );
    };


    return (
        <section className="w-[min(100%,_70rem)]  flex flex-col items-center px-[0.2rem] gap-[1rem]">

            {loading ? (
                <>
                    <div className="flex gap-[0.5rem]" >
                        <p>Chargement... </p>

                        <img className="loading w-6" src={loadingImg} alt="" />
                    </div>
                    <p className="mt-[-0.5rem]">peut parfois prendre 1 à 2 minutes</p>
                </>
            ) : vegReports.length === 0 ||
                vegReports.every((report) => report.results.length === 0) ? (
                <p>Les rapports pour la date sélectionnée ne sont pas disponibles</p>
            ) : (
                <>
                    {/* show unshow button */}
                    <button onClick={() => setVeggiesToShow(veggiesToShow.length === 6 ? [] : ["Cabbage", "Squash", "Peppers, Bell Type", "Broccoli", "Cauliflower", "Brussel"])} className=" active:scale-95 active:translate-y-1 shadow-lg  border-green-700 border-3 outline-2 outline-green-400 text-[0.8rem]  p-[0.5rem] rounded-[0.5rem] cursor-pointer">{veggiesToShow.length === 6 ? "Tout déselectionner" : "Tout sélectionner"}</button>
                    {/* ******** */}
                    <div className="grid grid-cols-2 gap-[0.5rem] w-[min(85%,_40rem)] lg:text-[1.2rem] lg:gap-x-[10rem] ">
                        <VeggieCheckbox id="cabbage" label="Choux" value="Cabbage" />
                        <VeggieCheckbox id="squash" label="Courgettes" value="Squash" />
                        <VeggieCheckbox id="peppers" label="Poivrons" value="Peppers, Bell Type" />
                        <VeggieCheckbox id="broccoli" label="Brocolis" value="Broccoli" />
                        <VeggieCheckbox id="brussels" label="Choux de Bruxelles" value="Brussel" />
                        <VeggieCheckbox id="cauliflower" label="Chou-fleur" value="Cauliflower" />
                    </div>
                    <p className="w-[80%] text-[0.8rem] text-center mt-[-0.5rem]">Cliquer ou Appuyer longuement sur une case pour ne sélectionner que celle-ci</p>

                    <ul className="flex flex-col lg:grid lg:grid-cols-2 gap-[0.25rem] w-[min(100%,_40rem)] lg:w-full">
                        {vegReports.flatMap((report, idx) =>
                            report.results
                                .filter(
                                    (result) =>
                                        veggiesToShow.some((kw: string) =>
                                            result.commodity.includes(kw)
                                        ) &&
                                        !(result.low_price === null && result.high_price === null)
                                        &&
                                        (result.commodity !== "Chinese Cabbage")
                                )
                                .map((result, rIdx) => (
                                    <li
                                        className="relative flex flex-col gap-[0.5rem] bg-white p-[0.5rem] pb-[1.2rem] lg:py-[2rem] rounded-[0.75rem] border-4 border-green-400 border-solid"
                                        key={`${idx}-${rIdx}`}
                                    >
                                        <h3 className="text-center lg:text-[1.1rem]">
                                            <strong>{result.market_location_city}</strong>:
                                        </h3>
                                        <div className="flex justify-between">
                                            <div className="flex flex-col gap-[0.5rem]">
                                                <div className=" items-center gap-[2rem]">
                                                    <p className="text-[1.3rem] lg:text-[1.5rem] font-bold">
                                                        {commodityDisplayName(result.commodity)}
                                                    </p>
                                                    <p>({result.item_size}, {result.pkg})</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p>
                                                        <span className="text-[1.2rem] font-bold">Bas: </span> $
                                                        {Number(result.low_price).toFixed(2)}usd, &nbsp;
                                                    </p>
                                                    <p>
                                                        <span className="text-[1.2rem] font-bold">Haut: </span> $
                                                        {Number(result.high_price).toFixed(2)}usd
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-right max-w-[270px]">
                                                <p className="text-[0.8rem] font-bold">
                                                    Disponibilité(offre): {result.supply_tone_comments ? commentsTranslation(result.supply_tone_comments) : "Pas d'info"}
                                                </p>
                                                <p className="text-[1rem] font-bold">
                                                    Demande : {commentsTranslation(result.demand_tone_comments) || "Pas d'info"}
                                                </p>

                                            </div>
                                        </div>
                                        <p className="text-[1rem] absolute bottom-[1.1rem] right-1">Bio : {result.organic === "N" ? "Non" : <span className="bg-[#FFF176] font-bold text-[1.1rem] px-[0.1rem]">OUI</span>}</p>
                                        <p className="text-[0.8rem] absolute bottom-0 right-1">
                                            {result.report_date}
                                        </p>
                                    </li>
                                ))
                        )}
                    </ul>
                </>
            )}
        </section>
    );
}

export default IndexPage;