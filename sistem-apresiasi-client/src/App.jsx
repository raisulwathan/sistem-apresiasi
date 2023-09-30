import styles from "./style";
import { Syarat, CTA, Footer, Navbar, Stats, Hero, Panduan } from "./components";

const App = () => (
  <div className="w-full overflow-hidden bg-primary">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Panduan />
        <Syarat />

        <CTA />
        <Footer />
      </div>
    </div>
  </div>
);

export default App;
