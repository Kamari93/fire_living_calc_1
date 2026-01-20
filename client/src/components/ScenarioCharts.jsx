import React from "react";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExpenseBarChart from "./ExpenseBarChart";
import ExpenseBarChartAnnual from "./ExpenseBarChartAnnual";
import ExpensePieChart from "./ExpensePieChart";
import NetWorthLineChart from "./NetWorthLineChart";
import IncomeVsExpensesPieChart from "./IncomeVsExpensesPieChart";
import LiabilitiesPieChart from "./LiabilitiesPieChart";
import IncomeVsLiabilitiesPieChart from "./IncomeVsLiabilitiesPieChart";
import { buildNetWorthProjectionsFromScenario } from "../services/netWorthUtils";

export default function ScenarioCharts({ scenario }) {
  const sliderRef = useRef(null);
  if (!scenario)
    return (
      <div className="text-gray-500">
        Select or create a scenario to see visualizations.
      </div>
    );
  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        // className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white text-blue-600 p-2 rounded-full shadow hover:bg-blue-100"
        className="mx-2 bg-white text-blue-600 p-2 rounded-full shadow hover:bg-blue-100"
      >
        <ChevronRight size={20} />
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        // className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white text-blue-600 p-2 rounded-full shadow hover:bg-blue-100"
        className="mx-2 bg-white text-blue-600 p-2 rounded-full shadow hover:bg-blue-100"
      >
        <ChevronLeft size={20} />
      </button>
    );
  }

  // Build net worth projections
  const { historical, fiTarget, estimated, realistic } =
    buildNetWorthProjectionsFromScenario(scenario);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Add custom instead
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // adaptiveHeight: true,
    appendDots: (dots) => (
      <div className="mt-4">
        <div className="flex items-center justify-center space-x-4">
          <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />
          <ul className="flex space-x-2">{dots}</ul>
          <NextArrow onClick={() => sliderRef.current?.slickNext()} />
        </div>
      </div>
    ),
  };

  return (
    <Slider ref={sliderRef} {...settings}>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Expenses (Bar)
        </h3>
        <ExpenseBarChart expenses={scenario.expenses} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Expenses Annual (Bar)
        </h3>
        <ExpenseBarChartAnnual expenses={scenario.expenses} />
      </div>
      {/* <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Expenses (Pie)
        </h3>
        <ExpensePieChart expenses={scenario.expenses} />
      </div> */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Expenses (Pie)
        </h3>
        <div className="flex justify-center items-center w-full">
          <ExpensePieChart expenses={scenario.expenses} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Net Worth Over Time
        </h3>
        <NetWorthLineChart
          // historical={scenario.netWorthHistory || []}
          // estimated={estimatedProjection}
          // realistic={realisticProjection}
          historical={historical}
          fiTarget={fiTarget}
          estimated={estimated}
          realistic={realistic}
        />
      </div>
      {/* <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Income vs Expenses
        </h3>
        <IncomeVsExpensesPieChart scenario={scenario} />
      </div> */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-700">
          Income vs Expenses
        </h3>
        <div className="flex justify-center items-center w-full">
          <IncomeVsExpensesPieChart scenario={scenario} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-red-700">
          Liabilities (Pie)
        </h3>
        <div className="flex justify-center items-center w-full">
          <LiabilitiesPieChart liabilities={scenario.liabilities} />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-red-700">
          Income vs Liabilities (Pie)
        </h3>
        <div className="flex justify-center items-center w-full">
          <IncomeVsLiabilitiesPieChart
            income={scenario.income}
            liabilities={scenario.liabilities}
          />
        </div>
      </div>
    </Slider>
  );
}

// import ExpenseBarChart from "./ExpenseBarChart";
// import NetWorthLineChart from "./NetWorthLineChart";
// import ExpensePieChart from "./ExpensePieChart";
// import IncomeVsExpensesPieChart from "./IncomeVsExpensesPieChart";

// export default function ScenarioCharts({ scenario }) {
//   if (!scenario) return null;

//   // Example net worth history (replace with real data if available)
//   const netWorthHistory = scenario.netWorthHistory || []; // Ensure netWorthHistory is defined and not null if it exists otherwise use an empty array

//   return (
//     <div>
//       <ExpenseBarChart expenses={scenario.expenses} />
//       <ExpensePieChart expenses={scenario.expenses} />
//       <NetWorthLineChart netWorthHistory={netWorthHistory} />
//       <IncomeVsExpensesPieChart scenario={scenario} />{" "}
//       {/* Pass the scenario to the IncomeVsExpensesPieChart */}
//     </div>
//   );
// }
