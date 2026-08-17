import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Camera,
} from "lucide-react";

const categories = [
  { name: "Phones", icon: Smartphone },
  { name: "Laptops", icon: Laptop },
  { name: "Audio", icon: Headphones },
  { name: "Wearables", icon: Watch },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Cameras", icon: Camera },
];

function CategoryBar() {
  return (
    <section className="categories" id="categories">

      <div className="section-heading">
        <div>
          <span className="eyebrow">EXPLORE</span>
          <h2>Shop by Category</h2>
        </div>

        <a href="#products">View all →</a>
      </div>

      <div className="category-grid">

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button className="category-card" key={category.name}>
              <div className="category-icon">
                <Icon size={25} />
              </div>

              <span>{category.name}</span>
            </button>
          );
        })}

      </div>

    </section>
  );
}

export default CategoryBar;