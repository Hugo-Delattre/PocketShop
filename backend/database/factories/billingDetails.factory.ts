import { setSeederFactory } from 'typeorm-extension';

import { BillingDetail } from 'src/billing-details/entities/billing-detail.entity';

export const billingDetailsFactory = setSeederFactory(
  BillingDetail,
  (faker) => {
    const billingDetail = new BillingDetail();

    billingDetail.address = faker.location.streetAddress();
    billingDetail.city = faker.location.city();
    billingDetail.name = faker.location.country();
    billingDetail.zip_code = faker.location.zipCode();
    billingDetail.country = faker.location.country();

    return billingDetail;
  },
);
