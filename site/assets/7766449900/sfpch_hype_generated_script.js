//	HYPE.documents["sfp-ch"]

(function(){(function k(){var h="sfp-ch.hyperesources",e="sfp-ch",d="sfpch_hype_container";if(false==!1)try{for(var f=document.getElementsByTagName("script"),b=0;b<f.length;b++){var a=f[b].src;if(null!=a&&-1!=a.indexOf("sfpch_hype_generated_script.js")){h=a.substr(0,a.lastIndexOf("/"));break}}}catch(n){}if(false==!1&&null==window.HYPE_338)null==window.HYPE_dtl_338?(window.HYPE_dtl_338=[],window.HYPE_dtl_338.push(k),e=document.getElementsByTagName("head")[0],d=document.createElement("script"),
b=navigator.userAgent.match(/MSIE (\d+\.\d+)/),b=parseFloat(b&&b[1])||null,d.type="text/javascript",d.src=h+"/"+(null!=b&&10>b?"HYPE.ie.js":"HYPE.js")+"?hype_version=338",e.appendChild(d)):window.HYPE_dtl_338.push(k);else{f=window.HYPE.documents;if(null!=f[e]){a=1;b=e;do e=""+b+"-"+a++;while(null!=f[e]);for(var c=document.getElementsByTagName("div"),a=!1,b=0;b<c.length;b++)if(c[b].id==d&&null==c[b].getAttribute("HYP_dn")){var a=1,g=d;do d=""+g+"-"+a++;while(null!=document.getElementById(d));c[b].id=
d;a=!0;break}if(!1==a)return}for(var a=new HYPE_338,c=[],c=[{name:"registerDocumentSpoken",source:"function(hypeDocument, element, event) {\tif (hypeDocument.registerSpoken) hypeDocument.registerSpoken({\n\t\t\"about-us\": {\n\t\t\togg: \"About%20Us.ogg\",\n\t\t\tmp3: \"About%20Us.mp3\"\n\t\t},\n\n\t\t\"intro-formula\": {\n\t\t\togg: \"Intro%20and%20Formula.ogg\",\n\t\t\tmp3: \"Intro%20and%20Formula.mp3\"\n\t\t},\n\n\t\t\"finding-home\": {\n\t\t\togg: \"Finding%20Home.ogg\",\n\t\t\tmp3: \"Finding%20Home.mp3\"\n\t\t},\n\n\t\t\"shopping-travel\": {\n\t\t\togg: \"Shopping%20and%20Travel.ogg\",\n\t\t\tmp3: \"Shopping%20and%20Travel.mp3\"\n\t\t},\n\n\t\t\"jc-intro\": {\n\t\t\togg: \"JC%20Intro.ogg\",\n\t\t\tmp3: \"JC%20Intro.mp3\"\n\t\t},\n\n\t\t\"work-permits\": {\n\t\t\togg: \"JC%20Work%20Permits.ogg\",\n\t\t\tmp3: \"JC%20Work%20Permits.mp3\"\n\t\t},\n\t\t\n\t\t\"jc-utilities\": {\n\t\t\togg: \"JC%20Utilities.ogg\",\n\t\t\tmp3: \"JC%20Utilities.mp3\"\n\t\t},\n\t\t\"jc-health\": {\n\t\t\togg: \"JC%20Health%20Insurance.ogg\",\n\t\t\tmp3: \"JC%20Health%20Insurance.mp3\"\n\t\t},\n\t\t\"jc-tax\": {\n\t\t\togg: \"JC%20Tax.ogg\",\n\t\t\tmp3: \"JC%20Tax.mp3\"\n\t\t},\n\t\t\"jc-banking\": {\n\t\t\togg: \"JC%20Banking.ogg\",\n\t\t\tmp3: \"JC%20Banking.mp3\"\n\t\t},\n\t\t\n\t\t\"jc-transport\": {\n\t\t\togg: \"JC%20Transport.ogg\",\n\t\t\tmp3: \"JC%20Transport.mp3\"\n\t\t},\n\t\t\"activities\": {\n\t\t\togg: \"Activities.ogg\",\n\t\t\tmp3: \"Activities.mp3\"\n\t\t},\n\n\t\t\"on-language\": {\n\t\t\togg: \"On%20Language.ogg\",\n\t\t\tmp3: \"On%20Language.mp3\"\n\t\t},\n\n\t\t\"socialising\": {\n\t\t\togg: \"Socialising.ogg\",\n\t\t\tmp3: \"Socialising.mp3\"\n\t\t}\n\t});\n}",identifier:"22"},{name:"queueNextSpoken",source:"function(hypeDocument, element, event) {\t// queue next spoken in registered\n\tif (hypeDocument.queueNextSpoken) hypeDocument.queueNextSpoken(hypeDocument.currentSceneName());\n\t\n}",identifier:"129"},{name:"continueAndPlaySpoken",source:"function(hypeDocument, element, event) {\tif (hypeDocument.playNextSpoken) hypeDocument.playNextSpoken(hypeDocument.currentSceneName());\n\thypeDocument.continueTimelineNamed(\"Main Timeline\");\t\n}",identifier:"130"},{name:"loadMainScene",source:"function(hypeDocument, element, event) {\n\tthis.defineSpokenScene(hypeDocument, element, [\"About Us.ogg\"]); \n}",identifier:"131"},{name:"loadFindingHome",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"Finding Home.ogg\"]);\n}",identifier:"132"},{name:"loadShoppingAndTravel",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"Shopping and Travel.ogg\"]);\n}",identifier:"133"},{name:"loadTheSwiss",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JC.ogg\"]); \n}",identifier:"134"},{name:"loadPermits",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCPermits.ogg\"]);\n}",identifier:"135"},{name:"loadUtilities",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCUtilities.ogg\"]);\n}",identifier:"136"},{name:"loadHealth",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCInsurance.ogg\"]); \n}",identifier:"137"},{name:"loadTax",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCTax.ogg\"]);\n}",identifier:"138"},{name:"loadBanking",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCBanking.ogg\"]);\n}",identifier:"139"},{name:"loadTransport",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCTransport.ogg\"]);\n}",identifier:"140"},{name:"loadActivities",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"Activities.ogg\"]);\n}",identifier:"141"},{name:"loadLanguage",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"JCLanguage.ogg\"]);\n}",identifier:"142"},{name:"loadSocialising",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"Socialising.ogg\"]);\n}",identifier:"143"},{name:"loadEnjoy",source:"function(hypeDocument, element, event) {\t\n\tthis.defineSpokenScene(hypeDocument, element, [\"Enjoy.ogg\"]);\n}",identifier:"144"},{name:"defineSpokenScene",source:"function(hypeDocument, element, event) {\tvar spoken;\n\tif (typeof event.length == \"number\") {\n\t\tspoken = {};\n\t\tfor(var i=0,name; name = event[i]; ++i) {\n\t\t\tspoken[name] = name;\n\t\t}\n\t} else {\n\t\t// simple mapping object passed\n\t\tspoken = event;\n\t}\n\t\n \thypeDocument.spokenScene = hypeDocument.spokenScene || {};\t\n\thypeDocument.spokenScene[hypeDocument.currentSceneName()] = spoken;\t\n\tif (hypeDocument.afterDefineScene) hypeDocument.afterDefineScene(hypeDocument.currentSceneName(), spoken, \"Main Timeline\");\n}",identifier:"145"},{name:"loadFormula",source:"function(hypeDocument, element, event) {\n\tthis.defineSpokenScene(hypeDocument, element, [\"Formula.ogg\"]);\n}",identifier:"246"}],g={},l={},b=0;b<c.length;b++)try{l[c[b].identifier]=c[b].name,g[c[b].name]=eval("(function(){return "+c[b].source+"})();")}catch(m){a.log(m),g[c[b].name]=function(){}}a.z_a({R:5,S:0,aI:0,T:0,bG:3,aJ:0,bH:2,aK:0,X:0,bI:3,aL:0,Y:1,bJ:3,bK:3,bL:3,a:0,b:0,c:0,d:0,aS:0,e:3,bQ:0,aT:0,f:2,g:5,bR:2,aU:0,bS:"NumberValueTransformer",aV:0,aW:3,A:5,l:2,aX:0,B:5,m:5,C:5,aY:2,n:5,D:5,E:0,aZ:0,G:5,t:0,bA:5,RotationAngle:2,tX:4,bB:0,M:0,N:0,bC:0,tY:4,O:0,P:0,Q:0});a.z_b({"60":{p:1,n:"people%20socialising.jpg",g:"110",o:true,t:"@1x"},"47":{n:"Intro%20and%20Formula.ogg",g:"2",t:"audio/ogg"},"54":{p:1,n:"Hard-Work.jpg",g:"201",t:"@1x"},"61":{p:1,n:"people%20socialising%402x.jpg",g:"110",o:true,t:"@2x"},"48":{n:"Intro%20and%20Formula.mp3",g:"2",t:"audio/mpeg"},"55":{p:1,n:"joining%20activities%20and%20groups.jpg",g:"72",o:true,t:"@1x"},"62":{p:1,n:"social.jpg",g:"112",t:"@1x"},"49":{n:"10francs.jpeg",g:"208",t:"@1x"},"56":{p:1,n:"joining%20activities%20and%20groups%402x.jpg",g:"72",o:true,t:"@2x"},"63":{p:1,n:"Swiss_passport.jpg",g:"214",o:true,t:"@1x"},"57":{p:1,n:"hiking.jpg",g:"74",t:"@1x"},"64":{p:1,n:"Swiss_passport%402x.jpg",g:"214",o:true,t:"@2x"},"58":{p:1,n:"oil.jpg",g:"146",t:"@1x"},"0":{n:"Shopping%20and%20Travel.ogg",g:"6",t:"audio/ogg"},"59":{p:1,n:"shopping%20switzerland.jpg",g:"71",t:"@1x"},"1":{n:"On%20Language.ogg",g:"18",t:"audio/ogg"},"2":{n:"Finding%20Home.ogg",g:"20",t:"audio/ogg"},"3":{p:1,n:"switzerland-outline.png",g:"8",t:"@1x"},"4":{n:"Shopping%20and%20Travel.mp3",g:"6",t:"audio/mpeg"},"5":{n:"On%20Language.mp3",g:"18",t:"audio/mpeg"},"6":{n:"Finding%20Home.mp3",g:"20",t:"audio/mpeg"},"7":{p:1,n:"how-to-ship-furniture-2.jpg",g:"34",t:"@1x"},"10":{p:1,n:"ATM%20banking.jpg",g:"73",t:"@1x"},"8":{p:1,n:"tbo_aeschbacher_jean-claude_2_201309.jpg",g:"46",t:"@1x"},"9":{p:1,n:"Train-trip-in-Switzerland.jpg",g:"56",t:"@1x"},"11":{p:1,n:"Kat-Henry-86-field.jpg",g:"125",t:"@1x"},"12":{p:1,n:"around-globe.png",g:"127",t:"@1x"},"13":{p:1,n:"grid.jpg",g:"148",t:"@1x"},"20":{n:"Assura%402x.jpg",g:"157",o:true,t:"@2x"},"21":{n:"B-Permit.png",g:"163",o:true,t:"@1x"},"14":{p:1,n:"surgery_2575339b.jpg",g:"150",t:"@1x"},"22":{n:"B-Permit%402x.png",g:"163",o:true,t:"@2x"},"15":{p:1,n:"Formula.png",g:"153",o:true,t:"@1x"},"30":{p:1,n:"Aldi_present_logo%402x.jpg",g:"183",o:true,t:"@2x"},"23":{p:1,n:"Cow-Grutzi.png",g:"168",t:"@1x"},"16":{p:1,n:"Formula%402x.png",g:"153",o:true,t:"@2x"},"31":{p:1,n:"coop-logo-001.jpg",g:"184",o:true,t:"@1x"},"24":{p:1,n:"StraightTruckFreightSpec.png",g:"178",t:"@1x"},"17":{p:1,n:"Swiss-Driving-Licence.gif",g:"155",t:"@1x"},"32":{p:1,n:"coop-logo-001%402x.jpg",g:"184",o:true,t:"@2x"},"25":{p:1,n:"Washingmachine.jpg",g:"180",o:true,t:"@1x"},"18":{p:1,n:"swiss%20money.jpg",g:"156",t:"@1x"},"40":{n:"ambulance-1.png",g:"213",t:"@1x"},"33":{p:1,n:"logo_migros.jpg",g:"185",o:true,t:"@1x"},"26":{p:1,n:"Washingmachine%402x.jpg",g:"180",o:true,t:"@2x"},"19":{n:"Assura.jpg",g:"157",o:true,t:"@1x"},"41":{p:1,n:"red-tv.png",g:"211",t:"@1x"},"34":{p:1,n:"logo_migros%402x.jpg",g:"185",o:true,t:"@2x"},"27":{p:1,n:"500px-Denner-Logo.svg.png",g:"182",o:true,t:"@1x"},"42":{p:1,n:"paperwork_by_malya.jpg",g:"216",o:true,t:"@1x"},"35":{p:1,n:"tram%20zurich.jpg",g:"195",t:"@1x"},"28":{p:1,n:"500px-Denner-Logo.svg%402x.png",g:"182",o:true,t:"@2x"},"43":{p:1,n:"paperwork_by_malya%402x.jpg",g:"216",o:true,t:"@2x"},"50":{n:"Cow.jpg",g:"70",t:"@1x"},"36":{n:"About%20Us.mp3",g:"12",t:"audio/mpeg"},"29":{p:1,n:"Aldi_present_logo.jpg",g:"183",o:true,t:"@1x"},"44":{n:"Halbtax.png",g:"225",t:"@1x"},"51":{p:1,n:"Depositphotos_18693181_s.jpg",g:"113",t:"@1x"},"37":{n:"About%20Us.ogg",g:"12",t:"audio/ogg"},"45":{p:1,n:"Spacelander-Bike.jpg",g:"227",t:"@1x"},"52":{p:1,n:"Depositphotos_12574431_s.jpg",g:"115",t:"@1x"},"38":{p:1,n:"jc.png",g:"203",t:"@1x"},"46":{p:1,n:"Zurich_Tram.jpg",g:"228",t:"@1x"},"39":{p:1,n:"utility-bills.png",g:"205",t:"@1x"},"53":{n:"L-permit.jpg",g:"159",t:"@1x"}});a.z_c([]);a.z_d([{x:0,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"131"}]},v:{"120":{b:454,z:"38",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"37",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"82"}]},F:"center",G:"#000000",aP:"pointer",w:"<div>Banking</div>",x:"visible",I:"None",a:331,y:"preserve",J:"None"},"19":{b:665,z:"35",K:"None",c:118,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"12",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"95"}]},F:"center",G:"#000000",aP:"pointer",w:"On Language",x:"visible",I:"None",a:265,y:"preserve",J:"None"},"21":{b:147,z:"45",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"37",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"48"}]},F:"center",G:"#000000",aP:"pointer",w:"Finding Home",x:"visible",I:"None",a:399,y:"preserve",J:"None"},"128":{h:"127",p:"no-repeat",x:"visible",a:28,q:"100% 100%",b:73,j:"absolute",r:"inline",c:171,k:"div",z:"22",d:192},"3":{b:174,z:"46",K:"None",c:155,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"36",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:1,e:"233"}]},F:"center",G:"#000000",aP:"pointer",w:"Intro and Formula",x:"visible",I:"None",a:210,y:"preserve",J:"None"},"117":{b:351,z:"41",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"37",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"65"}]},F:"center",G:"#000000",aP:"pointer",w:"Utilities",x:"visible",I:"None",a:520,y:"preserve",J:"None"},"123":{b:738,z:"34",K:"None",c:118,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"13",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"99"}]},F:"center",G:"#000000",aP:"pointer",w:"Socialising",x:"visible",I:"None",a:524,y:"preserve",J:"None"},"126":{h:"125",p:"no-repeat",x:"visible",a:-234,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1404,k:"div",z:"2",d:936,i:"kat-henry-bg",b:0},"121":{b:510,z:"37",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"13",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"87"}]},F:"center",G:"#000000",aP:"pointer",w:"<div>Transport</div>",x:"visible",I:"None",a:520,y:"preserve",J:"None"},"27":{b:293,z:"43",K:"None",c:142,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"36",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"43"}]},F:"center",G:"#000000",aP:"pointer",w:"Ask the Swiss",x:"visible",I:"None",a:64,y:"preserve",J:"None"},"118":{b:378,z:"40",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"33",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"69"}]},F:"center",G:"#000000",aP:"pointer",w:"Health<div><br></div>",x:"visible",I:"None",a:713,y:"preserve",J:"None"},"124":{b:238,z:"33",K:"None",c:118,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"36",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"none",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"103"}]},F:"center",G:"#000000",aP:"pointer",w:"Enjoy",x:"visible",I:"None",a:339,y:"preserve",J:"None"},"7":{b:238,z:"44",K:"None",c:177,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"33",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"55"}]},F:"center",G:"#000000",aP:"pointer",w:"Shopping and Travel",x:"visible",I:"None",a:608,y:"preserve",J:"None"},"122":{b:606,z:"36",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"9",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"91"}]},F:"center",G:"#000000",aP:"pointer",w:"<div>Groups and Activities</div>",x:"visible",I:"None",a:713,y:"preserve",J:"None"},"29":{b:331,z:"42",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"37",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"61"}]},F:"center",G:"#000000",aP:"pointer",w:"Work Permits",x:"visible",I:"None",a:330,y:"preserve",J:"None"},"119":{b:405,z:"39",K:"None",c:125,L:"None",d:15,aS:6,M:0,bD:"none",e:"1.000000",N:0,aT:6,bS:"36",O:0,aU:6,P:0,aV:6,j:"absolute",k:"div",A:"#A0A0A0",B:"#A0A0A0",Z:"break-word",r:"inline",C:"#A0A0A0",s:"Didot,'Times New Roman',serif",D:"#A0A0A0",t:18,aA:{a:[{d:1.1000000238418579,p:1,g:2,e:"78"}]},F:"center",G:"#000000",aP:"pointer",w:"<div>Tax</div>",x:"visible",I:"None",a:73,y:"preserve",J:"None"},"9":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"127",j:"absolute",r:"inline",c:936,k:"div",z:"3",d:660,b:119}},n:"About Us",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:978,a:[{f:"2",p:2,y:91,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"},{f:"2",y:977,z:1,i:"e",e:"0.000000",s:"1.000000",o:"27"},{f:"2",y:977,z:1,i:"e",e:"0.000000",s:"1.000000",o:"21"},{f:"2",y:977,z:1,i:"e",e:"0.000000",s:"1.000000",o:"19"},{f:"2",y:977,z:1,i:"e",e:"0.000000",s:"1.000000",o:"7"},{f:"2",y:977,z:1,i:"e",e:"0.000000",s:"1.000000",o:"3"},{f:"2",y:977,z:1,i:"e",e:"0.000000",s:"1.000000",o:"29"},{y:978,i:"e",s:"0.000000",z:0,o:"27",f:"2"},{y:978,i:"e",s:"0.000000",z:0,o:"29",f:"2"},{y:978,i:"e",s:"0.000000",z:0,o:"21",f:"2"},{y:978,i:"e",s:"0.000000",z:0,o:"19",f:"2"},{y:978,i:"e",s:"0.000000",z:0,o:"7",f:"2"},{y:978,i:"e",s:"0.000000",z:0,o:"3",f:"2"}],f:30}},o:"1"},{x:1,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"246"}]},v:{"247":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Formula",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"10",aS:8,aT:8,a:382,bA:"#212121",b:343},"242":{bR:"-10deg",h:"72",p:"no-repeat",a:50,bS:"36",q:"100% 100%",x:"visible",j:"absolute",r:"inline",c:356,k:"div",z:"7",d:200,b:432,aY:"-10deg",e:"0.000000"},"236":{h:"153",p:"no-repeat",x:"visible",a:285,q:"100% 100%",bS:"45",j:"absolute",r:"inline",c:366,k:"div",z:"3",d:366,b:261,e:"0.000000"},"239":{bR:"0deg",h:"155",p:"no-repeat",a:237,bS:"13",q:"100% 100%",x:"visible",j:"absolute",r:"inline",c:180,k:"div",z:"2",d:125,bF:"237",aY:"10deg",aW:"0.223430",b:159},"245":{h:"127",p:"no-repeat",x:"visible",a:28,q:"100% 100%",b:73,j:"absolute",r:"inline",c:171,k:"div",z:"4",d:192},"234":{h:"125",p:"no-repeat",x:"visible",a:-234,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1404,k:"div",z:"1",d:936,b:0},"240":{h:"163",p:"no-repeat",x:"visible",a:46,q:"100% 100%",bS:"13",j:"absolute",r:"inline",c:139,k:"div",z:"3",d:192,bF:"237",aW:"0.141979",b:184},"237":{k:"div",x:"visible",c:200,d:128,z:"5",e:"0.000000",a:352,bS:"45",j:"absolute",b:371},"243":{h:"168",p:"no-repeat",x:"visible",a:356,q:"100% 100%",bS:"13",j:"absolute",r:"inline",c:281,k:"div",z:"8",d:318,b:431,e:"0.000000"},"235":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"127",j:"absolute",r:"inline",c:936,k:"div",z:"2",d:660,b:119},"241":{bR:"-10deg",h:"110",p:"no-repeat",a:548,bS:"33",q:"100% 100%",x:"visible",j:"absolute",r:"inline",c:314,k:"div",z:"6",d:198,b:444,aY:"10deg",e:"0.000000",f:"0deg"},"238":{h:"157",p:"no-repeat",a:-219,bS:"13",q:"100% 100%",x:"visible",j:"absolute",r:"inline",c:200,k:"div",z:"1",d:128,bF:"237",aY:"-10deg",aW:"0.193727",b:146,f:"0deg"}},n:"Formula",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:886.01,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"247"},{y:2,i:"e",s:"0.000000",z:0,o:"247",f:"2"},{f:"2",y:130,z:1,i:"e",e:"1.000000",s:"0.000000",o:"236"},{y:131,i:"e",s:"1.000000",z:0,o:"236",f:"2"},{f:"2",y:168,z:1,i:"e",e:"1.000000",s:"0.000000",o:"237"},{f:"2",y:169,z:71,i:"e",e:"1.000000",s:"1.000000",o:"237"},{f:"2",y:240,z:1.01,i:"e",e:"0.000000",s:"1.000000",o:"237"},{y:241.01,i:"e",s:"0.000000",z:0,o:"237",f:"2"},{f:"2",y:244,z:1,i:"e",e:"1.000000",s:"0.000000",o:"242"},{f:"2",y:245,z:115,i:"e",e:"1.000000",s:"1.000000",o:"242"},{f:"2",y:360,z:1,i:"e",e:"0.000000",s:"1.000000",o:"242"},{y:361,i:"e",s:"0.000000",z:0,o:"242",f:"2"},{f:"2",y:362,z:1,i:"e",e:"1.000000",s:"0.000000",o:"243"},{f:"2",y:363,z:226,i:"e",e:"1.000000",s:"1.000000",o:"243"},{f:"2",y:589,z:1,i:"e",e:"0.000000",s:"1.000000",o:"243"},{f:"2",y:590,z:1,i:"e",e:"1.000000",s:"0.000000",o:"241"},{y:590,i:"e",s:"0.000000",z:0,o:"243",f:"2"},{y:591,i:"e",s:"1.000000",z:0,o:"241",f:"2"},{f:"2",p:2,y:886.01,z:0,i:"ActionHandler",s:{a:[{d:0.89999999999999991,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"233"},{x:2,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"132"}]},v:{"176":{aU:8,G:"#000000",bS:"45",aV:8,r:"inline",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://flatfox.ch\">FlatFox</a>",bF:"171",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"4",aS:8,aT:8,a:29,b:317},"171":{k:"div",x:"visible",c:126,d:47,z:"3",e:"0.000000",a:373,j:"absolute",b:247},"179":{h:"178",p:"no-repeat",x:"visible",a:342,q:"100% 100%",bS:"45",j:"absolute",r:"inline",c:300,k:"div",z:"4",d:200,b:552,e:"0.000000"},"174":{aU:8,G:"#000000",bS:"45",aV:8,r:"inline",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://immostreet.ch\">Immostreet</a>",bF:"171",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"3",aS:8,aT:8,a:-159,b:95},"248":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Finding a Home",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"7",aS:8,aT:8,a:290,bA:"#212121",b:343},"177":{aU:8,G:"#000000",bS:"45",aV:8,r:"inline",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://bekeys.ch\">Bekeys</a>",bF:"171",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"6",aS:8,aT:8,a:9,b:46},"49":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"2",d:660,b:119},"51":{h:"34",p:"no-repeat",x:"visible",a:-679,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1903,k:"div",z:"1",d:936,b:0},"181":{h:"180",p:"no-repeat",x:"visible",a:537,q:"100% 100%",bS:"41",j:"absolute",r:"inline",c:399,k:"div",z:"5",d:266,b:304,e:"0.000000"},"170":{aU:8,G:"#000000",bS:"45",aV:8,r:"inline",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://home.ch\">Home</a>",bF:"171",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"1",aS:8,aT:8,a:-276,b:178},"175":{aU:8,G:"#000000",bS:"45",aV:8,r:"inline",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://immoscout24.ch\">Immoscout 24</a>",bF:"171",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"5",aS:8,aT:8,a:117,b:424},"173":{aU:8,G:"#000000",bS:"45",aV:8,r:"inline",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://homegate.ch\">Homegate</a>",bF:"171",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"2",aS:8,aT:8,a:-204,b:270}},n:"Finding Home",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:1153,a:[{f:"2",y:1.01,z:0.29,i:"e",e:"0.000000",s:"1.000000",o:"248"},{y:2,i:"e",s:"0.000000",z:0,o:"248",f:"2"},{f:"2",y:159.15,z:0.15,i:"e",e:"1.000000",s:"0.000000",o:"171"},{y:160,i:"e",s:"1.000000",z:0,o:"171",f:"2"},{f:"2",y:541.16,z:0.14,i:"e",e:"1.000000",s:"0.000000",o:"179"},{y:542,i:"e",s:"1.000000",z:0,o:"179",f:"2"},{f:"2",y:1046.17,z:0.14,i:"e",e:"1.000000",s:"0.000000",o:"181"},{y:1047.01,i:"e",s:"1.000000",z:0,o:"181",f:"2"},{f:"2",p:2,y:1153,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"48"},{x:3,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"133"}]},v:{"187":{h:"182",p:"no-repeat",x:"visible",a:-76,q:"100% 100%",bS:"45",j:"absolute",r:"inline",c:234,k:"div",z:"2",d:81,bF:"190",b:-123},"193":{aU:8,G:"#FFFFFF",c:168,bS:"45",aV:8,r:"inline",d:31,e:"0.000000",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://interdiscount.ch\">Interdiscount</a>",bF:"194",j:"absolute",x:"visible",k:"div",y:"preserve",z:"2",aS:8,aT:8,a:0,b:0},"196":{h:"195",p:"no-repeat",x:"visible",a:-193,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1323,k:"div",z:"5",d:936,b:0,e:"0.000000"},"191":{aU:8,G:"#FFFFFF",bS:"45",aV:8,r:"inline",e:"0.000000",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://ricardo.ch\">Ricardo</a>",bF:"194",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",z:"1",aS:8,aT:8,a:-106,b:-182},"109":{h:"71",p:"no-repeat",x:"visible",a:-238,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1381,k:"div",z:"3",d:936,b:0},"54":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"6",d:660,b:119},"194":{k:"div",x:"visible",c:184,d:47,z:"13",e:"1.000000",a:650,bS:"36",j:"absolute",b:436},"188":{h:"183",p:"no-repeat",a:207,bS:"45",q:"100% 100%",x:"visible",j:"absolute",r:"inline",c:96,k:"div",z:"1",d:114,bF:"190",b:-156,e:"1.000000"},"197":{h:"156",p:"no-repeat",x:"visible",a:-242,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1390,k:"div",z:"4",d:936,b:0,e:"0.000000"},"186":{h:"185",p:"no-repeat",x:"visible",a:-76,q:"100% 100%",bS:"45",j:"absolute",r:"inline",c:252,k:"div",z:"3",d:74,bF:"190",b:-233},"192":{aU:8,G:"#FFFFFF",c:103,bS:"45",aV:8,r:"inline",d:31,e:"0.000000",s:"Didot,'Times New Roman',serif",t:24,Z:"break-word",w:"<a href=\"http://anibis.ch\">Anibis</a>",bF:"194",j:"absolute",x:"visible",k:"div",y:"preserve",z:"3",aS:8,aT:8,a:-89,b:-135},"249":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Shopping and Travel",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"15",aS:8,aT:8,a:240,bA:"#212121",b:343},"189":{h:"184",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"45",j:"absolute",r:"inline",c:234,k:"div",z:"4",d:70,bF:"190",b:0},"190":{k:"div",x:"visible",c:288,d:86,z:"10",e:"0.000000",a:324,bS:"45",j:"absolute",b:552}},n:"Shopping and Travel",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:1070,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"249"},{y:2,i:"e",s:"0.000000",z:0,o:"249",f:"2"},{f:"2",y:70.15,z:0.16,i:"e",e:"1.000000",s:"0.000000",o:"190"},{f:"2",y:71.01,z:224,i:"e",e:"1.000000",s:"1.000000",o:"190"},{f:"2",y:137.15,z:0.16,i:"e",e:"1.000000",s:"0.000000",o:"193"},{f:"2",y:137.16,z:0.15,i:"e",e:"1.000000",s:"0.000000",o:"191"},{f:"2",y:137.16,z:0.15,i:"e",e:"1.000000",s:"0.000000",o:"192"},{y:138.01,i:"e",s:"1.000000",z:0,o:"192",f:"2"},{y:138.01,i:"e",s:"1.000000",z:0,o:"191",f:"2"},{y:138.01,i:"e",s:"1.000000",z:0,o:"193",f:"2"},{f:"2",y:295.01,z:0.29,i:"e",e:"1.000000",s:"0.000000",o:"197"},{f:"2",y:295.01,z:0.29,i:"e",e:"0.000000",s:"1.000000",o:"194"},{f:"2",y:295.01,z:0.29,i:"e",e:"0.000000",s:"1.000000",o:"190"},{y:296,i:"e",s:"1.000000",z:0,o:"197",f:"2"},{y:296,i:"e",s:"0.000000",z:0,o:"194",f:"2"},{y:296,i:"e",s:"0.000000",z:0,o:"190",f:"2"},{f:"2",y:447.01,z:0.29,i:"e",e:"1.000000",s:"0.000000",o:"196"},{y:448,i:"e",s:"1.000000",z:0,o:"196",f:"2"},{f:"2",p:2,y:1070,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"55"},{x:4,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"134"}]},v:{"202":{h:"201",p:"no-repeat",x:"visible",a:-188,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1311,k:"div",z:"2",d:936,b:0},"44":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"3",d:660,b:119},"250":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Good Advice",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"6",aS:8,aT:8,a:322,bA:"#212121",b:343},"204":{h:"203",p:"no-repeat",x:"visible",a:658,q:"100% 100%",bS:"9",j:"absolute",r:"inline",c:350,k:"div",z:"4",d:319,b:671}},n:"TheSwiss",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:204,a:[{f:"2",y:1.01,z:0.29,i:"e",e:"0.000000",s:"1.000000",o:"250"},{y:2,i:"e",s:"0.000000",z:0,o:"250",f:"2"},{f:"2",p:2,y:204,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"43"},{x:5,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"135"}]},v:{"251":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Work Permit",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"10",aS:8,aT:8,a:328,bA:"#212121",b:343},"147":{h:"146",p:"no-repeat",x:"visible",a:-232,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1400,k:"div",z:"3",d:936,b:0},"217":{h:"216",p:"no-repeat",x:"visible",a:294,q:"100% 100%",bS:"37",j:"absolute",r:"inline",c:316,k:"div",z:"8",d:213,b:57},"215":{h:"214",p:"no-repeat",x:"visible",a:44,q:"100% 100%",bS:"44",j:"absolute",r:"inline",c:241,k:"div",z:"7",d:330,b:265},"60":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"5",d:660,b:119}},n:"JCPermits",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:320,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"251"},{y:2,i:"e",s:"0.000000",z:0,o:"251",f:"2"},{f:"2",p:2,y:320,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"61"},{x:6,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"136"}]},v:{"220":{h:"205",p:"no-repeat",x:"visible",a:540,q:"100% 100%",bS:"41",j:"absolute",r:"inline",c:366,k:"div",z:"7",d:324,b:287},"218":{h:"211",p:"no-repeat",x:"visible",a:112,q:"100% 100%",bS:"12",j:"absolute",r:"inline",c:230,k:"div",z:"5",d:293,b:413},"232":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Utilities",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"8",aS:8,aT:8,a:382,bA:"#212121",b:343},"219":{aU:8,bB:0,G:"#FFFFFF",aV:8,r:"inline",bC:0,s:"Helvetica,Arial,Sans-Serif",t:24,Z:"break-word",w:"Billag.ch",j:"absolute",x:"visible",yy:"nowrap",k:"div",y:"preserve",aZ:0,z:"6",aS:8,aT:8,a:159,bA:"#000000",b:413},"64":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"4",d:660,b:119},"149":{h:"148",p:"no-repeat",x:"visible",a:-187,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1310,k:"div",z:"3",d:936,b:0}},n:"JCUtilities",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:865,a:[{f:"2",y:0,z:1,i:"e",e:"1.000000",s:"1.000000",o:"232"},{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"232"},{y:2,i:"e",s:"0.000000",z:0,o:"232",f:"2"},{f:"2",p:2,y:865,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"65"},{x:7,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"137"}]},v:{"222":{h:"157",p:"no-repeat",x:"visible",a:48,q:"100% 100%",bS:"36",j:"absolute",r:"inline",c:241,k:"div",z:"6",d:154,b:449},"66":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"4",d:660,b:119},"252":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Health Insurance",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"8",aS:8,aT:8,a:278,bA:"#212121",b:343},"221":{h:"213",p:"no-repeat",x:"visible",a:570,q:"100% 100%",bS:"41",j:"absolute",r:"inline",c:350,k:"div",z:"5",d:162,b:387},"151":{h:"150",p:"no-repeat",x:"visible",a:-282,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1500,k:"div",z:"3",d:936,b:0}},n:"JCInsurance",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:989,a:[{f:"2",y:1.01,z:1,i:"e",e:"0.000000",s:"1.000000",o:"252"},{y:2.01,i:"e",s:"0.000000",z:0,o:"252",f:"2"},{f:"2",p:2,y:989,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"69"},{x:8,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"138"}]},v:{"253":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Tax",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"6",aS:8,aT:8,a:422,bA:"#212121",b:343},"116":{h:"115",p:"no-repeat",x:"visible",a:-159,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1403,k:"div",z:"3",d:936,b:0},"76":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"4",d:660,b:119}},n:"JCTax",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:660,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"253"},{y:2,i:"e",s:"0.000000",z:0,o:"253",f:"2"},{f:"2",p:2,y:660,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"78"},{x:9,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"139"}]},v:{"83":{h:"73",p:"no-repeat",x:"visible",a:-156,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1248,k:"div",z:"3",d:936,b:0},"254":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Banking",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"6",aS:8,aT:8,a:373,bA:"#212121",b:343},"81":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"4",d:660,b:119}},n:"JCBanking",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:489,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"254"},{y:2,i:"e",s:"0.000000",z:0,o:"254",f:"2"},{f:"2",p:2,y:489,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"82"},{x:10,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"140"}]},v:{"229":{h:"228",p:"no-repeat",x:"visible",a:98,q:"100% 100%",b:36,j:"absolute",r:"inline",c:320,k:"div",z:"7",d:240},"226":{h:"225",p:"no-repeat",x:"visible",a:591,q:"100% 100%",bS:"41",j:"absolute",r:"inline",c:283,k:"div",z:"6",d:181,b:353},"255":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Transport",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"10",aS:8,aT:8,a:358,bA:"#212121",b:343},"86":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"5",d:660,b:119},"108":{h:"56",p:"no-repeat",x:"visible",a:-263,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1430,k:"div",z:"4",d:936,b:0},"230":{h:"227",p:"no-repeat",x:"visible",a:252,q:"100% 100%",bS:"13",j:"absolute",r:"inline",c:400,k:"div",z:"8",d:264,b:568}},n:"JCTransport",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:994,a:[{f:"2",y:1,z:1.01,i:"e",e:"0.000000",s:"1.000000",o:"255"},{y:2.01,i:"e",s:"0.000000",z:0,o:"255",f:"2"},{f:"2",p:2,y:994,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"87"},{x:11,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"141"}]},v:{"256":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Activities",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"7",aS:8,aT:8,a:365,bA:"#212121",b:343},"104":{h:"72",p:"no-repeat",x:"visible",a:-542,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1667,k:"div",z:"4",d:936,b:0},"88":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"5",d:660,b:119}},n:"Activities",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:2.01,a:[{f:"2",y:1,z:1.01,i:"e",e:"0.000000",s:"1.000000",o:"256"},{y:2.01,i:"e",s:"0.000000",z:0,o:"256",f:"2"}],f:30}},o:"91"},{x:12,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"142"}]},v:{"105":{h:"70",p:"no-repeat",x:"visible",a:-54,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1045,k:"div",z:"4",d:1045,b:0},"106":{c:260,d:181,I:"Solid",J:"Solid",K:"Solid",g:"#FFFFFF",L:"Solid",M:3,N:3,aI:"50%",A:"#A0A0A0",x:"visible",j:"absolute",B:"#A0A0A0",k:"div",O:3,P:3,z:"6",C:"#A0A0A0",D:"#A0A0A0",aK:"50%",aJ:"50%",a:437,aL:"50%",b:483},"107":{aV:8,w:"Gr\u00fctzi",a:496,x:"visible",Z:"break-word",y:"preserve",j:"absolute",r:"inline",z:"7",k:"div",s:"Optima,'Lucida Grande',Helvetica,sans-serif",aT:8,yy:"nowrap",t:48,b:540,aS:8,aU:8,G:"#000000"},"93":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"5",d:660,b:119},"257":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Language",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"9",aS:8,aT:8,a:353,bA:"#212121",b:343}},n:"JCLanguage",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:1066,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"257"},{y:2,i:"e",s:"0.000000",z:0,o:"257",f:"2"},{f:"2",p:2,y:1066,z:0,i:"ActionHandler",s:{a:[{d:1.1000000238418579,p:1,g:2,f:1}]},o:"kTimelineDefaultIdentifier"}],f:30}},o:"95"},{x:13,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"143"}]},v:{"258":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Socialising",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"7",aS:8,aT:8,a:345,bA:"#212121",b:343},"111":{h:"110",p:"no-repeat",x:"visible",a:-289,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1485,k:"div",z:"4",d:936,b:0},"97":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"5",d:660,b:119}},n:"Socialising",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:2,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"258"},{y:2,i:"e",s:"0.000000",z:0,o:"258",f:"2"}],f:30}},o:"99"},{x:14,p:"600px",c:"#FFFFFF",A:{a:[{p:4,h:"144"}]},v:{"114":{h:"113",p:"no-repeat",x:"visible",a:-268,q:"100% 100%",bS:"191",j:"absolute",r:"inline",c:1405,k:"div",z:"4",d:936,b:0},"259":{aU:8,bB:3,G:"#FFFFFF",bS:"45",aV:8,r:"inline",bC:3,e:"1.000000",s:"Helvetica,Arial,Sans-Serif",t:48,Z:"break-word",w:"Enjoy",j:"absolute",yy:"nowrap",x:"visible",k:"div",y:"preserve",aZ:5,z:"7",aS:8,aT:8,a:399,bA:"#212121",b:343},"100":{h:"8",p:"no-repeat",x:"visible",a:0,q:"100% 100%",bS:"119",j:"absolute",r:"inline",c:936,k:"div",z:"5",d:660,b:119}},n:"Enjoy",T:{kTimelineDefaultIdentifier:{i:"kTimelineDefaultIdentifier",n:"Main Timeline",z:2,a:[{f:"2",y:1,z:1,i:"e",e:"0.000000",s:"1.000000",o:"259"},{y:2,i:"e",s:"0.000000",z:0,o:"259",f:"2"}],f:30}},o:"103"}]);a.z_q(936,936);a.z_e(l);a.z_p=g;a.z_f(0);a.z_g(d);a.z_h(h);
a.z_i(0);a.z_j(false);a.z_k(false);a.z_l(true);a.z_m(true);a.z_n(e);f[e]=a.API;document.getElementById(d).setAttribute("HYP_dn",e);a.z_o(this.body)}})();})();