import "./TabMenu.scss";

const TabMenu = ({ tabs, selected, onChange }) => {
  return (
    <div className="TabMenu_wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={selected === tab ? "active" : ""}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
