import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Variete() {
    type vegInfo = {
        commodity: string;
        lo_prices: number[];
        hi_prices: number[];
        pkg: string;
    };

    type VegResult = {
        market_location_city: string;
        commodity: string;
        item_size: string;
        pkg: string;
        low_price: string;
        high_price: string;
        organic: string;
        var?: string; // variety field
    };

    type outletContextType = {
        vegReports: { results: VegResult[] }[];
        loading: boolean;
    };

    const { vegReports, loading } = useOutletContext<outletContextType>();

    const [aggregatedInfo, setAggregatedInfo] = useState<vegInfo[]>([]);

    // commodity translation
    const commodityMap: Record<string, string> = {
        "Cabbage": "Chou",
        "Squash, Zucchini": "Zucchini",
        "Squash, Yellow Straightneck": "Courgette Jaune",
        "Peppers, Bell Type": "Poivron",
        "Broccoli": "Brocoli",
        "Cauliflower": "Chou-fleur",
        "Brussels Sprouts": "Choux de Bruxelles",
        "Lettuce, Red Leaf": "Laitue frisée rouge",
        "Lettuce, Green Leaf": "Laitue frisée verte",
        "Lettuce, Romaine": "Laitue romaine",
        "Lettuce, Iceberg": "Laitue iceberg",
    };

    // variety translation
    const commentsTranslation = (comments: string) => {
        switch (comments) {
            case "HEARTS":
                return "Cœurs";
            case "CROWN CUT":
                return "Couronnes";
            case "ROUND GREEN TYPE":
                return "Rond Vert";
            case "RED TYPE":
                return "Rouge";
            default:
                return comments;
        }
    };

    useEffect(() => {
        const freshState: Record<
            string,
            { commodity: string; pkg: string; lo_prices: number[]; hi_prices: number[] }
        > = {};

        vegReports
            .flatMap((report) => report.results)
            .filter((result) => result.organic?.toUpperCase() !== "Y")
            .forEach((result) => {
                const displayName = commodityMap[result.commodity];
                if (displayName) {
                    const hasVar = result.var && result.var !== "N/A";
                    const varPart = hasVar ? ` (${commentsTranslation(result.var!)})` : "";
                    const pkgPart = result.pkg ? ` - ${result.pkg}` : "";

                    // group by commodity + variety + pkg
                    const key = `${displayName}${varPart}${pkgPart}`;

                    if (!freshState[key]) {
                        freshState[key] = {
                            commodity: `${displayName}${varPart}`, // keep pkg separate
                            pkg: result.pkg,
                            lo_prices: [],
                            hi_prices: [],
                        };
                    }

                    if (result.low_price) {
                        freshState[key].lo_prices.push(parseFloat(result.low_price));
                    }
                    if (result.high_price) {
                        freshState[key].hi_prices.push(parseFloat(result.high_price));
                    }
                }
            });

        setAggregatedInfo(
            Object.values(freshState).sort((a, b) =>
                a.commodity.localeCompare(b.commodity)
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vegReports]);

    return (
        <section className="w-[min(100%,_40rem)] flex flex-col items-center px-[0.2rem] gap-[1rem]">
            {loading ? (
                <p>Chargement...</p>
            ) : vegReports.length === 0 ||
                vegReports.every((report) => report.results.length === 0) ? (
                <p>Les rapports pour la date sélectionnée ne sont pas disponibles</p>
            ) : (
                <>
                    <p className=" relative w-[80%] text-center text-[1.2rem]">
                        *Les Prix montrés ci-dessous excluent les prix bio*
                    </p>
                    <ul className="flex flex-col gap-[0.25rem] w-[min(100%,_40rem)]">
                        {aggregatedInfo.map((veg) => {
                            const loAvg =
                                veg.lo_prices.length > 0
                                    ? (
                                        veg.lo_prices.reduce((a, b) => a + b, 0) /
                                        veg.lo_prices.length
                                    ).toFixed(2)
                                    : "N/A";
                            const hiAvg =
                                veg.hi_prices.length > 0
                                    ? (
                                        veg.hi_prices.reduce((a, b) => a + b, 0) /
                                        veg.hi_prices.length
                                    ).toFixed(2)
                                    : "N/A";

                            return (
                                <li
                                    key={veg.commodity}
                                    className="flex flex-col gap-[0.75rem] bg-white p-[0.75rem] rounded-[0.75rem] border-4 border-green-400 border-solid"
                                >
                                    <h3 className="text-[1.5rem] font-bold text-center">
                                        {veg.commodity}
                                    </h3>
                                    {veg.pkg && (
                                        <p className="text-center mt-[-0.75rem]">
                                            {veg.pkg}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="text-center">
                                            Prix bas moyen: <br />
                                            $<span className="font-bold text-[1.2rem]">{loAvg}</span> usd
                                        </p>
                                        <p className="text-center">
                                            Prix haut moyen: <br />
                                            $<span className="font-bold text-[1.2rem]">{hiAvg}</span> usd
                                        </p>
                                    </div>
                                </li>
                            );
                        })
                        }
                    </ul>
                </>
            )}
        </section>
    );
}

export default Variete;
