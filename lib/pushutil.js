//
// Copyright (C) 2011-2012 Jeff Wilcox
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

exports.isValidUri = function (uri) {
    if (uri.indexOf("http://") !== 0) {
        if (uri.indexOf("https://") !== 0) {
            return false;
        }
    }

    // windows phone
    if (uri.indexOf("live.net/") === -1) {
        
    	// windows 8
	    if (uri.indexOf("windows.com/") === -1) {
	    	return false;
	    }
    }

    return true;
}
