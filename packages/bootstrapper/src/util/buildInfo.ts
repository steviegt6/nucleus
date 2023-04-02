/* buildInfo.ts
 *   Reads the build_info.json file and returns the contents as a JSON object.
 */

import _electron from "electron";
import { join } from "path";
import { BUILD_INFO_PATH } from "./constants";

const buildInfo = require(join(process.resourcesPath, BUILD_INFO_PATH));
export default buildInfo;
