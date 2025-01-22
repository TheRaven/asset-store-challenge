## Changes

### Frontend

  - Updated the page to display the price of the selected product

**To do**
  - Could use tanstack/query like the dashboard to cache data
  - Should add test coverage
  - Add a storybook for component development


### Backend

- Updated nginx config to add some throttling.
- Added code to make calls to the legacy api.
- Added basic redis instance
- Added wrapper client to cache results coming from legacy api.

**To do**
a lot of cleanup is needed in the index.ts file.

better error handling of calls made to the legacy API. right now it simply fails it it's not 200 but the error returned to the caller is not great

Use a proper logger instead of console. something like pino.

More test coverage `index.ts` is currently not covered by either e2e tests or unit tests.

**Configuration**

Would also load the configuration (CACHE_DURATION_IN_SECONDS, LEGACY_SERVICE_API, redis url) from the environment with a validator in place and fail to start in case of errors so that the deployment could be rolled back