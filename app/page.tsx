import Image from "next/image";
import HomeBanner from "./component/pages/Hompage/HomeBanner";
import CustomerName from "./component/pages/Hompage/CustmerName";
import ProductSlider from "./component/pages/Hompage/ProductSlider";
import TestimonialSection from "./component/section/TestimonialSection";

export default function Home() {
  return (
    <div >
      <HomeBanner/>
      <CustomerName/>
      <ProductSlider/>
      <TestimonialSection/>
    </div>
  );
}
