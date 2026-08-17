# PRISMA Digital Platform — Product Blueprint

## Core idea

PRISMA is not treated as a brochure site. It is a vehicle-discovery, comparison and lead-qualification platform for a multi-operator renting business.

The public experience should help a visitor:
1. see real vehicles and reference prices quickly;
2. narrow choices by actual needs;
3. save and compare candidates;
4. configure the request variables that matter;
5. contact PRISMA with the context already attached.

## Public platform

Implemented in the concept:
- product-first vehicle hero;
- live catalogue filters and sorting;
- vehicle detail pages;
- persistent favourites;
- comparison of up to 3 vehicles;
- request configurator for profile, term, annual mileage and timing;
- contextual WhatsApp messages;
- matching tool based on profile / use / budget;
- separate Alta Gama experience with a different art direction;
- multi-brand concept connected through the same PRISMA platform.

Next implementation layers:
- real catalogue ingestion/CMS;
- offer availability and operator fields;
- actual configurable pricing or operator quote integration;
- lead persistence;
- authentication and roles;
- CRM pipeline;
- analytics;
- rate limiting and server-side validation;
- programmatic SEO migration and route parity;
- schema.org Vehicle/Product/Organization/FAQ;
- dynamic sitemap, canonicals and redirects.

## Multi-brand backoffice

One underlying platform should be able to operate:
- PRISMA Renting;
- Renting Alta Gama;
- future Grupo PRISMA verticals.

Brand-specific frontends should not imply duplicated inventory or duplicated CRM infrastructure.

## Data integrity

Reference prices shown in this prototype are public-offer references and are not calculated dynamically.

When the user changes term or mileage, the interface prepares a qualified request rather than inventing a new monthly fee.
