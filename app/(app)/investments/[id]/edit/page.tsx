import { InvestmentForm } from "@/components/investment-form";
import { SectionHeading } from "@/components/section-heading";
import { getInvestmentForEdit } from "@/lib/data";

export default async function EditInvestmentPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investment = await getInvestmentForEdit(id);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <SectionHeading
        eyebrow="Edit investment"
        title={`Update ${investment.name}`}
        description="Changes to duration, return assumptions, or contribution structure will recalculate generated installments."
      />
      <InvestmentForm investment={investment} cancelHref={`/investments/${investment.id}`} />
    </div>
  );
}
