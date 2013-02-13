//
// Copyright (C) Jeff Wilcox
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
// ---------------------------------------------------------------------------
// 4th & Mayor Mail Listener (for app crash mails)
// ---------------------------------------------------------------------------

require('./lib/context').initialize(require('./lib/configuration'), function (err, context) {
    if (err) {
    	console.dir(err);
    } else {
        var el = require('email-listener');
        var uuid = require('node-uuid');
        var azure = require('azure');

        var config = context.configuration;
        var containerName = config.azure.container.mail;

    	// Drop in Azure storage container for now.
    	var blobService = azure.createBlobService(
    		config.azure.storageaccount, 
    		config.azure.storagekey);
		blobService.createContainerIfNotExists(
			containerName, 
			function (error){
		    if(!error){
		        // Listen on port 25 for incoming e-mail.
		        el.start();
		        el.on('msg', function (recipient, raw, parsed) {
		        	var id = uuid.v1(); // time-based UUID

					if (parsed.text) {
						var json = undefined;
						var text = parsed.text;
						var start = text.indexOf('{');
						var end = text.lastIndexOf('}');

						if (start >= 0 && end >= 0) {
							text = text.substring(start, end - start + 1);
							
							try {
								var obj = JSON.parse(text);
								if (obj !== undefined) {
									json = JSON.stringify(obj);
								}
							}
							catch (e) {
								// TODO: Need to start logging properly.
							}
						}

			        	blobService.createBlockBlobFromText(containerName, id + '.txt', raw, function (err) {
			        		if (!err) {
			        			// parsed.from[0].address, name 
			        		}

			        		if (err) {
			        			console.dir(err);
			        		} else if (json !== undefined) {       			
			        			blobService.createBlockBlobFromText(containerName, id + '.json', json, function (err) {
			        				if (err) {

			        				}
			        			});
			        		}
			        	});
					} else {
						// Not valid JSON sent.
					}
		        });
		    }
		});
	}
});
