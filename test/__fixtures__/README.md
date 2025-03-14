# Test fixtures convention

- Test fixtures should be nested appropriately. If the corresponding test is located directly in `/test`, then its
  fixtures should be stored in `/test/__fixtures__`
- If the corresponding tests are located in a subdirectory, e.g. `/test/carousel/CarouselComponent.test.tsx`, then its
  fixtures should be inside that directory, e.g. `/test/carousel/__fixtures__/CarouselData.fixtures.json`
- Also, to ease searches, we encourage the fixtures file to end include `.fixtures` before the file extension.

**NOTE:** This README file can be removed when adding actual fixtures, as it currently serves as a placeholder.
