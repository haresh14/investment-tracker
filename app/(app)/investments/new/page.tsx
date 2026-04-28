import { InvestmentForm } from "@/components/investment-form";
import { SectionHeading } from "@/components/section-heading";

export default function NewInvestmentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <SectionHeading
        eyebrow="New investment"
        title="Add a SIP or lumpsum"
        description="Create a projection-ready investment with installment-level compounding and source attribution."
      />
      <InvestmentForm />
    </div>
  );
}
