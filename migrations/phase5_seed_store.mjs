// Generates seed SQL for products + product_prices from the local STORE_PRODUCTS model.
import { STORE_PRODUCTS } from '../src/data/platformConfig.js';

// DB course ids (from public.courses) keyed by code + level name
const DB_COURSES = {
  // ATSWA ATS 1 (local display codes in comments map to DB codes)
  'BAPS|ATSWA ATS 1': '028e409c-d813-4022-8a61-7cb61b3b540f',
  'BIZL|ATSWA ATS 1': '6921851b-f9da-4796-bbd1-dcaa9b2c0895',
  'COMM|ATSWA ATS 1': '69740f29-e356-44a0-8712-e42a77d3f189',
  'ECON|ATSWA ATS 1': '194f6a18-f744-4bfb-a8a1-a365bef18d70',
  'BLW|ATSWA ATS 1': '6921851b-f9da-4796-bbd1-dcaa9b2c0895',
  'COM|ATSWA ATS 1': '69740f29-e356-44a0-8712-e42a77d3f189',
  'ECO|ATSWA ATS 1': '194f6a18-f744-4bfb-a8a1-a365bef18d70',
  // ATSWA ATS 2
  'FA|ATSWA ATS 2': 'db7bacce-453b-4c0e-8fdf-189f38df51b9',
  'IT|ATSWA ATS 2': '8f977def-fe74-4fc8-a0ac-1dd1688b07da',
  'PSA|ATSWA ATS 2': '17747149-81b5-4b22-a33d-2af94cff96ab',
  'QA|ATSWA ATS 2': '7d246ba1-1fd0-4714-a0e1-387a38fe861c',
  // ATSWA ATS 3
  'AUD|ATSWA ATS 3': 'dc6fbce4-4454-4203-9baf-8ddcfa70f7da',
  'CA|ATSWA ATS 3': 'c7e082ce-3a1b-4b50-a3e6-59f92b04945f',
  'MGMT|ATSWA ATS 3': '47a06919-b24e-40a9-b6b6-e87b1a9ebafe',
  'TAX|ATSWA ATS 3': '297b7e06-3c56-44fb-92c6-d70864490238',
  'COST|ATSWA ATS 3': 'c7e082ce-3a1b-4b50-a3e6-59f92b04945f',
  'MGT|ATSWA ATS 3': '47a06919-b24e-40a9-b6b6-e87b1a9ebafe',
  // ICAN Foundation
  'BE|ICAN Foundation': 'da7bd397-03a9-470c-867b-7ea6f161527a',
  'CBL|ICAN Foundation': '5e153f60-e433-4da0-97a6-d6240f5d1d4b',
  'FA|ICAN Foundation': 'aa44673b-1852-4896-a449-4ffb931c90ec',
  'MA|ICAN Foundation': 'c21d21bc-c70e-44b2-b1e5-c991d6137f94',
  // ICAN Professional
  'AAAF|ICAN Professional': '35b3e640-b276-4c26-b47e-80650e3d7449',
  'ATAX|ICAN Professional': '802dc627-d13d-4881-90b1-edaaf4ffe41f',
  'CS|ICAN Professional': 'de1aa3cb-d7ba-498b-ab66-afc29e764f97',
  'SBR|ICAN Professional': '45cdf80f-29a3-4cd2-aa6a-ad5f31815e90',
  'SFM|ICAN Professional': '5356eb30-ca7a-44af-8ee0-782aad33d96c',
  // ICAN Skills
  'AAF|ICAN Skills': '9a397dd1-f214-49ea-a173-227c8d390629',
  'FM|ICAN Skills': 'd2199d0e-be75-457d-9483-4772911b7e88',
  'FR|ICAN Skills': '361c4bf1-0797-4684-811d-2ea9c26c3965',
  'PM|ICAN Skills': '54d6558d-4804-4dad-880f-9760213fc84a',
  'PSAF|ICAN Skills': '7de9cb22-fe08-4d9c-a13f-b17c1b13a5a9',
  'TAX|ICAN Skills': '9fee9755-1609-4aaf-8959-8c2786afc58c',
};

const DB_LEVELS = {
  'ATSWA ATS 1': '7aa54cc8-ad77-4fce-851b-96a9d7e072a9',
  'ATSWA ATS 2': '9a14d35a-1764-41a3-a188-273e337b471c',
  'ATSWA ATS 3': 'bee21c5a-74d9-4a19-98ca-f7294b9dfede',
  'ICAN Foundation': '7d99a9cc-4f8b-4612-b1e5-c667aa0aac36',
  'ICAN Professional': '9ac8b298-fccb-40b8-af02-c65bd068fa07',
  'ICAN Skills': '5954605f-4620-4415-9952-7e5aa8d700d6',
};

// Map local product level to DB level name
const LEVEL_MAP = {
  'ATS 1': 'ATSWA ATS 1',
  'ATS 2': 'ATSWA ATS 2',
  'ATS 3': 'ATSWA ATS 3',
  'Foundation': 'ICAN Foundation',
  'Skills': 'ICAN Skills',
  'Professional': 'ICAN Professional',
};

const productType = (cat) => (cat.endsWith('past_question') ? 'past_question' : 'study_pack');

const productInserts = [];
const priceInserts = [];

STORE_PRODUCTS.forEach((p) => {
  const dbLevel = LEVEL_MAP[p.level] || p.level;
  const levelId = DB_LEVELS[dbLevel] || null;
  // Per-course products (past questions + ICAN study packs) have a courseCode
  let courseId = null;
  if (p.courseCode) {
    courseId = DB_COURSES[`${p.courseCode}|${dbLevel}`] || null;
  }
  const name = p.title;
  const description = p.description || '';
  // Deterministic uuid derived from the local product id so prices can reference it.
  // course_id left NULL (FK to courses); the frontend merges by product name, so the
  // course link is not required for the store UI.
  const pid = `md5('${p.id}')::uuid`;
  productInserts.push(
    `  (${pid}, '${name}', '${description.replace(/'/g, "''")}', '${productType(p.category)}', NULL, ${levelId ? `'${levelId}'` : 'NULL'}, '${p.imageUrl || ''}', ${p.isAvailable === false ? 'false' : 'true'}, '${(p.availabilityNote || '').replace(/'/g, "''")}')`
  );
  priceInserts.push(`  (${pid}, '${p.price}'::int)`);
});

const sql = `-- Phase 5: Seed 45 store products + product_prices (from local STORE_PRODUCTS model)
INSERT INTO public.products (id, name, description, product_type, course_id, examination_level_id, image_url, is_available, availability_note)
VALUES
${productInserts.join(',\n')}
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_prices (product_id, price_ngn)
SELECT id, price_ngn FROM (VALUES
${priceInserts.join(',\n')}
) AS v(id, price_ngn)
WHERE NOT EXISTS (SELECT 1 FROM public.product_prices pp WHERE pp.product_id = v.id);
`;

console.log(sql);
console.error(`Generated ${productInserts.length} products and ${priceInserts.length} prices`);
