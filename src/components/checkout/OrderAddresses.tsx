import { OrderDetailsAddress } from "@/server/types/order";

function phoneLabel(address: OrderDetailsAddress) {
  const number = address.phone_number?.trim();
  if (!number) return "";
  return number.startsWith("+") ? number : `+${number}`;
}

function OrderAddressBlock({
  title,
  address,
  heading,
}: {
  title: string;
  address: OrderDetailsAddress;
  heading: "h2" | "h3";
}) {
  const Heading = heading;
  const name = address.full_name?.trim() || [address.first_name, address.last_name].filter(Boolean).join(" ").trim();
  const line = [address.city, address.state, address.postal_code, address.country].filter(Boolean).join(", ");
  const phone = phoneLabel(address);

  return (
    <div>
      <Heading className="text-base font-bold">{title}</Heading>
      <address className="mt-2 text-sm leading-6 text-muted not-italic">
        {name ? <span className="block font-semibold text-heading">{name}</span> : null}
        {address.street_address ? <span className="block">{address.street_address}</span> : null}
        {line ? <span className="block">{line}</span> : null}
        {phone ? (
          <span className="block">
            <bdi>{phone}</bdi>
          </span>
        ) : null}
        {address.email ? <span className="block">{address.email}</span> : null}
      </address>
    </div>
  );
}

export default function OrderAddresses({
  shipping,
  billing,
  shippingLabel,
  billingLabel,
  heading = "h2",
}: {
  shipping?: OrderDetailsAddress | null;
  billing?: OrderDetailsAddress | null;
  shippingLabel: string;
  billingLabel: string;
  heading?: "h2" | "h3";
}) {
  if (!shipping && !billing) return null;

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {shipping ? <OrderAddressBlock title={shippingLabel} address={shipping} heading={heading} /> : null}
      {billing ? <OrderAddressBlock title={billingLabel} address={billing} heading={heading} /> : null}
    </div>
  );
}
