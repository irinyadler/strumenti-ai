(() => {
    "use strict";
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout(() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }, duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
                lockPaddingElements.forEach(lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                });
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }, delay);
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach(lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            });
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            });
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach(mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach(spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                });
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach(spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
                                spollerBlock.open = false;
                            }, spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach(spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout(() => {
                                spollerCloseBlock.open = false;
                            }, spollerSpeed);
                        }
                    });
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout(() => {
                        spollerActiveBlock.open = false;
                    }, spollerSpeed);
                }
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        });
        const hasSubs = document.querySelectorAll(".js-has-sub");
        const MOBILE_MAX = getMobileMax();
        function isMobile() {
            return window.matchMedia(`(max-width:${MOBILE_MAX}px)`).matches;
        }
        function closeAllSubs(except = null) {
            hasSubs.forEach(item => {
                if (except && item === except) return;
                item.classList.remove("is-open");
                const link = item.querySelector(".menu__link[aria-expanded]");
                const toggle = item.querySelector(".menu__toggle");
                if (link) link.setAttribute("aria-expanded", "false");
                if (toggle) toggle.setAttribute("aria-expanded", "false");
            });
        }
        hasSubs.forEach(item => {
            const link = item.querySelector(".menu__link");
            const toggle = item.querySelector(".menu__toggle");
            const sub = item.querySelector(".menu__sublist");
            if (!sub) return;
            const handler = e => {
                if (!isMobile()) return;
                if (e.target.closest(".menu__link")) e.preventDefault();
                const isOpen = item.classList.contains("is-open");
                closeAllSubs(item);
                item.classList.toggle("is-open", !isOpen);
                const expanded = String(!isOpen);
                if (link) link.setAttribute("aria-expanded", expanded);
                if (toggle) toggle.setAttribute("aria-expanded", expanded);
            };
            if (toggle) toggle.addEventListener("click", e => {
                e.preventDefault();
                handler(e);
            });
            if (link) link.addEventListener("click", handler);
            if (link) link.addEventListener("keydown", e => {
                if (!isMobile()) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handler(e);
                }
            });
        });
        document.addEventListener("click", e => {
            if (!isMobile()) return;
            if (!e.target.closest(".menu__item--has-sub")) closeAllSubs();
        });
        let lastMobile = isMobile();
        window.addEventListener("resize", () => {
            const nowMobile = isMobile();
            if (lastMobile !== nowMobile) {
                closeAllSubs();
                lastMobile = nowMobile;
            }
        });
        function getMobileMax() {
            return 768;
        }
    }
    function uniqArray(array) {
        return array.filter(function(item, index, self) {
            return self.indexOf(item) === index;
        });
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter(function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        });
        if (media.length) {
            const breakpointsArray = [];
            media.forEach(item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });
            let mdQueries = breakpointsArray.map(function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            });
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach(breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter(function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    });
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                });
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout(() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", function(e) {
                document.dispatchEvent(windowScroll);
            });
        }
    }, 0);
    const TOOLS = [ {
        id: 1,
        name: "ChatGPT",
        url: "https://chat.openai.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg",
        description: "Chatbot avanzato per scrittura, coding e assistenza.",
        tags: [ "Chatbot", "Scrittura", "Produttività" ],
        pricing: "Freemium",
        addedAt: "2025-01-03T10:00:00Z",
        popularity: 98,
        categorySlug: "chatbot",
        strengths: [ "Ottimo per scrittura e brainstorming", "Supporto forte per coding e debugging", "Versatile per lavoro e studio" ]
    }, {
        id: 2,
        name: "Claude",
        url: "https://claude.ai",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg",
        description: "Assistente AI orientato a sicurezza e affidabilità.",
        tags: [ "Chatbot", "Business" ],
        pricing: "Freemium",
        addedAt: "2025-01-08T09:30:00Z",
        popularity: 94,
        categorySlug: "chatbot",
        strengths: [ "Focalizzato su sicurezza e affidabilità", "Ottimo per testi lunghi e analisi", "Adatto a contesti business" ]
    }, {
        id: 3,
        name: "Perplexity",
        url: "https://www.perplexity.ai",
        logo: "https://static.vecteezy.com/system/resources/previews/051/336/393/non_2x/perplexity-ai-transparent-logo-free-png.png",
        description: "Motore di ricerca con AI e citazioni alle fonti.",
        tags: [ "Chatbot", "Ricerca" ],
        pricing: "Freemium",
        addedAt: "2024-12-18T12:00:00Z",
        popularity: 92,
        categorySlug: "chatbot",
        strengths: [ "Risposte orientate alla ricerca", "Utile per trovare e sintetizzare info", "Esperienza tipo “search + chat”" ]
    }, {
        id: 4,
        name: "Pi",
        url: "https://pi.ai",
        logo: "https://play-lh.googleusercontent.com/Ef7is-Xonqhs2agdsGarpTS_c1Is6Yvk-JhnL3qNvU1Nwdc7kn6Dml2IuCqlfa9Nuzk=w240-h480-rw",
        description: "Assistente conversazionale empatico e sempre attivo.",
        tags: [ "Chatbot" ],
        pricing: "Freemium",
        addedAt: "2024-11-25T15:00:00Z",
        popularity: 85,
        categorySlug: "chatbot",
        strengths: [ "Conversazione naturale e “umana”", "Ideale per chat quotidiane", "Onboarding semplice" ]
    }, {
        id: 5,
        name: "Character.AI",
        url: "https://character.ai",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY9n0N2F5XU7dfD_w1hltVfCCEik4NFa3pAw&s",
        description: "Crea personaggi AI con personalità personalizzate.",
        tags: [ "Chatbot", "Intrattenimento" ],
        pricing: "Freemium",
        addedAt: "2024-12-05T17:10:00Z",
        popularity: 90,
        categorySlug: "chatbot",
        strengths: [ "Personaggi e role-play personalizzati", "Molto adatto all’intrattenimento", "Ampia varietà di stili conversazionali" ]
    }, {
        id: 6,
        name: "Paradot AI",
        url: "https://paradot.ai",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/02/86/73/028673e3-b73c-cdbe-832e-107a546e0b3e/AppIcon_new-0-0-1x_U007emarketing-0-6-0-85-220.png/1200x630wa.png",
        description: "Compagno virtuale AI progettato per conversazioni significative, relazione e supporto emotivo personalizzato.",
        tags: [ "Chatbot", "Benessere" ],
        pricing: "Freemium",
        addedAt: "2024-10-22T08:20:00Z",
        popularity: 80,
        categorySlug: "chatbot",
        strengths: [ "Compagno virtuale con memoria e personalità persistente", "Conversazioni empatiche orientate al benessere emotivo", "Interazione personalizzata basata sulla relazione con l’utente" ]
    }, {
        id: 7,
        name: "Jasper Chat",
        url: "https://www.jasper.ai",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaCYKaKssGPtiWV4cO-9-l17k3xI8mQVg6Dg&s",
        description: "Assistente AI per marketing e copywriting.",
        tags: [ "Chatbot", "Marketing" ],
        pricing: "A pagamento",
        addedAt: "2024-11-12T11:45:00Z",
        popularity: 88,
        categorySlug: "chatbot",
        strengths: [ "Copywriting e marketing oriented", "Utile per campagne e contenuti", "Pensato per team e workflow" ]
    }, {
        id: 8,
        name: "You.com Chat",
        url: "https://you.com",
        logo: "https://cdn.prod.website-files.com/687f2dca0cbe61df74670d5b/68ee24a7a493b49a46e2bd3f_Inside%20you.com_%20Benchmarking%20the%20Leading%20AI%20Chat%20Experience.webp",
        description: "Motore di ricerca con chat AI integrata.",
        tags: [ "Chatbot", "Ricerca" ],
        pricing: "Freemium",
        addedAt: "2024-12-28T09:10:00Z",
        popularity: 86,
        categorySlug: "chatbot",
        strengths: [ "Ricerca web con chat integrata", "Risultati rapidi e pratici", "Buono per esplorare argomenti" ]
    }, {
        id: 9,
        name: "Le Chat (Mistral)",
        url: "https://chat.mistral.ai",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAsVBMVEUWFhbhBQD/ggX/rwD6UA//1wAAABcTFhbcBgQPFRX/sgD/jwRSExLrAwABFhf/hQT9bgoABxcMDhb/twC0XQ4ADxZEPBTfngf0Qgz/2wDNagsZFRW/owu/hAsMCxe9PhLGrQqZhA7yqACZbQ7BZA2ZUg/GQhKYNhPGCQi7CwsXERbRRRFXJBU4MRUuKRX/4QDTlAe/bAyZWQ+/Vg/kaAyZRhBNHRVGExPCNA5xIBGnLBDvc+pSAAABp0lEQVR4nO3ab1MBURSAcaL9F4uWJKSkWkpUivr+H6zedY5mb3dn7hqa5/f23LM93cwwjVIJAAAAAAAAALAPTrUdLFo8en4mza0fvrX45LLKG/SOhYFnvXgl93rX1otWUQv57DxR8rdZEEUUUUQRRZRNlJ99Vo78YqN6OkoO+5lNBd/UMJHGXWmoPo/Mlmqo9pIbt1FRRYqk7qU46c/Gcqa2KsVGqcDlVlTmSaKIIoooog4pqrTLqCTKknQ9ZZx5MnIc9XxicKGYTr44jZocGTQU08HbltMo08+yRhRRRBFFFFEWUQ3Tu51h6Daq9dqUVm1pomZNNWuv1Oyt4zCqM6pKI6/1w3tXs2pL8u7U7L7IKPns+FFHhfKfQTFRhqhwH6O4KW7KdRQ3ddA3VWBUGAu/ouRwKypWtqPkLPy7QvPXNWG9OZc2avjxoNQMi5/6qTmr/H5al8qamqUdJbBfjHNHlW2lsXgV+aXAenFaZJT8KxBFFFFEEXW4UfUdRk0DS+WpjkptF4O8Ud+fp6zpL2349puG76Zk3ZU9R4sAAAAAAAAA8D99AT+RkEnhWtAyAAAAAElFTkSuQmCC",
        description: "Chatbot di Mistral AI focalizzato su velocità e controllo.",
        tags: [ "Chatbot", "Sviluppo" ],
        pricing: "Freemium",
        addedAt: "2025-01-15T10:30:00Z",
        popularity: 89,
        categorySlug: "chatbot",
        strengths: [ "Risposte veloci", "Utile per sviluppatori e power users", "Buon controllo su output e stile" ]
    }, {
        id: 10,
        name: "Gemini",
        url: "https://gemini.google.com",
        logo: "https://static.vecteezy.com/system/resources/previews/055/687/065/non_2x/gemini-google-icon-symbol-logo-free-png.png",
        description: "Suite di modelli AI di Google integrata in Workspace.",
        tags: [ "Chatbot", "Produttività" ],
        pricing: "Freemium",
        addedAt: "2025-01-20T13:00:00Z",
        popularity: 93,
        categorySlug: "chatbot",
        strengths: [ "Forte integrazione con ecosistema Google", "Utile per produttività e workflow", "Buono per uso quotidiano in ufficio" ]
    }, {
        id: 11,
        name: "Midjourney",
        url: "https://www.midjourney.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
        description: "Generazione di immagini artistiche da prompt testuali.",
        tags: [ "Immagine", "Generazione" ],
        pricing: "A pagamento",
        addedAt: "2024-11-01T12:00:00Z",
        popularity: 96,
        categorySlug: "immagine",
        strengths: [ "Alta qualità artistica e stile", "Ottimo per concept e illustrazioni", "Risultati coerenti e d’impatto" ]
    }, {
        id: 12,
        name: "DALL·E",
        url: "https://openai.com/dall-e-3",
        logo: "https://i.pinimg.com/736x/6f/06/5f/6f065fa852e5404f95f4ca4cffe49ed5.jpg",
        description: "Generatore di immagini di OpenAI integrato in ChatGPT.",
        tags: [ "Immagine", "Generazione" ],
        pricing: "Freemium",
        addedAt: "2024-12-10T09:00:00Z",
        popularity: 94,
        categorySlug: "immagine",
        strengths: [ "Generazione immagini semplice da usare", "Buono per concept e creatività rapida", "Integrazione comoda con ChatGPT" ]
    }, {
        id: 13,
        name: "Stable Diffusion XL",
        url: "https://stablediffusionxl.com/",
        logo: "https://stablediffusionxl.com/wp-content/uploads/2023/04/cropped-cropped-brush.png",
        description: "Modello open-source per generazione immagini di alta qualità.",
        tags: [ "Immagine", "Open Source" ],
        pricing: "Gratis",
        addedAt: "2024-10-30T16:40:00Z",
        popularity: 91,
        categorySlug: "immagine",
        strengths: [ "Open-source e personalizzabile", "Ottimo per workflow avanzati", "Ampio ecosistema di modelli e tool" ]
    }, {
        id: 14,
        name: "Leonardo AI",
        url: "https://leonardo.ai",
        logo: "data:image/jpeg;base64,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",
        description: "Piattaforma per creare asset grafici per giochi e media.",
        tags: [ "Immagine", "Design" ],
        pricing: "Freemium",
        addedAt: "2024-12-22T14:15:00Z",
        popularity: 90,
        categorySlug: "immagine",
        strengths: [ "Asset per giochi e media", "Buono per design iterativo", "Workflow orientato a creativi" ]
    }, {
        id: 15,
        name: "Ideogram",
        url: "https://ideogram.ai",
        logo: "https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/ideogram.png",
        description: "Generatore di immagini con testo leggibile (poster, loghi, meme).",
        tags: [ "Immagine", "Tipografia" ],
        pricing: "Freemium",
        addedAt: "2025-01-02T10:25:00Z",
        popularity: 88,
        categorySlug: "immagine",
        strengths: [ "Testo più leggibile nelle immagini", "Ideale per poster e contenuti social", "Utile per bozze di loghi e titoli" ]
    }, {
        id: 16,
        name: "Canva AI",
        url: "https://www.canva.com",
        logo: "https://digital-school.online/wp-content/uploads/2024/07/canva-ai-1199x674.jpg",
        description: "Strumenti AI integrati per design, presentazioni e social.",
        tags: [ "Immagine", "Produttività" ],
        pricing: "Freemium",
        addedAt: "2025-01-05T08:30:00Z",
        popularity: 89,
        categorySlug: "immagine",
        strengths: [ "Design rapido con template", "Ottimo per social e presentazioni", "Facile anche per non designer" ]
    }, {
        id: 17,
        name: "Adobe Firefly",
        url: "https://www.adobe.com/sensei/generative-ai/firefly.html",
        logo: "https://www.adobe.com/cc-shared/assets/img/firefly.svg",
        description: "Motore generativo Adobe integrato in Photoshop e Express.",
        tags: [ "Immagine", "Design" ],
        pricing: "Freemium",
        addedAt: "2024-11-18T11:55:00Z",
        popularity: 87,
        categorySlug: "immagine",
        strengths: [ "Integrazione con strumenti Adobe", "Utile per editing e varianti creative", "Buono per flussi di lavoro professionali" ]
    }, {
        id: 18,
        name: "Playground AI",
        url: "https://playground.com",
        logo: "https://cdn-1.webcatalog.io/catalog/playground-ai/playground-ai-social-preview.png?v=1714776725001",
        description: "Piattaforma per generazione immagini con vari modelli.",
        tags: [ "Immagine", "Generazione" ],
        pricing: "Freemium",
        addedAt: "2024-12-27T13:45:00Z",
        popularity: 85,
        categorySlug: "immagine",
        strengths: [ "Più modelli in un’unica piattaforma", "Buono per sperimentare stili diversi", "Controlli utili per iterare velocemente" ]
    }, {
        id: 19,
        name: "Runway Gen-2",
        url: "https://runwayml.com",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDXIK2WqGiQST-IzoCfRsLUP5IrFPBnCTEnA&s",
        description: "Generazione video da testo, immagine o clip di riferimento.",
        tags: [ "Video", "Generazione" ],
        pricing: "Freemium",
        addedAt: "2024-12-25T15:00:00Z",
        popularity: 92,
        categorySlug: "video",
        strengths: [ "Video generativi avanzati", "Buono per creatività e prototipi", "Workflow orientato a creator" ]
    }, {
        id: 20,
        name: "Pika Labs",
        url: "https://pika.art",
        logo: "https://mms.businesswire.com/media/20231127388431/en/1953853/5/WhatsApp_Image_2023-11-27_at_19.10.06.jpg?download=1",
        description: "Strumento per creare video brevi con prompt testuali.",
        tags: [ "Video", "Generazione" ],
        pricing: "Freemium",
        addedAt: "2025-01-10T11:00:00Z",
        popularity: 94,
        categorySlug: "video",
        strengths: [ "Ideale per video brevi", "Prompt semplice e veloce", "Perfetto per social e demo" ]
    }, {
        id: 21,
        name: "Synthesia",
        url: "https://www.synthesia.io",
        logo: "https://ubos.tech/wp-content/uploads/2024/03/Synthesia-Ai-jpg.webp",
        description: "Video con avatar parlanti generati da testo, ideale per corsi e training.",
        tags: [ "Video", "Avatar" ],
        pricing: "A pagamento",
        addedAt: "2024-11-08T09:20:00Z",
        popularity: 90,
        categorySlug: "video",
        strengths: [ "Avatar parlanti per training e corsi", "Produzione video senza riprese", "Utile per comunicazione aziendale" ]
    }, {
        id: 22,
        name: "Descript",
        url: "https://www.descript.com",
        logo: "https://logosandtypes.com/wp-content/uploads/2024/01/Descript.png",
        description: "Editor audio/video basato su testo con funzioni AI.",
        tags: [ "Video", "Audio", "Editing" ],
        pricing: "Freemium",
        addedAt: "2024-10-29T10:10:00Z",
        popularity: 88,
        categorySlug: "video",
        strengths: [ "Editing come un documento di testo", "Ottimo per podcast e video talking-head", "Funzioni AI per velocizzare il montaggio" ]
    }, {
        id: 23,
        name: "Opus Clip",
        url: "https://www.opus.pro",
        logo: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/zj32vjamplqygwckiq8l?ik-sanitizeSvg=true",
        description: "Trasforma video lunghi in clip brevi ottimizzate per social.",
        tags: [ "Video", "Clip", "Social" ],
        pricing: "Freemium",
        addedAt: "2024-12-12T13:30:00Z",
        popularity: 86,
        categorySlug: "video",
        strengths: [ "Trasforma contenuti lunghi in shorts", "Ottimizzato per social", "Risparmia tempo su repurposing" ]
    }, {
        id: 24,
        name: "HeyGen",
        url: "https://www.heygen.com",
        logo: "https://img.icons8.com/?size=100&id=nYpTA1hyYtTK&format=png&color=000000",
        description: "Video con avatar AI lip-sync in molte lingue.",
        tags: [ "Video", "Avatar" ],
        pricing: "A pagamento",
        addedAt: "2024-11-30T16:00:00Z",
        popularity: 89,
        categorySlug: "video",
        strengths: [ "Avatar con lip-sync multilingua", "Utile per contenuti marketing", "Produzione veloce senza studio" ]
    }, {
        id: 25,
        name: "Veed.io",
        url: "https://www.veed.io/ai",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqVwCd1RTHJXM8VZ5z9SQqnWLInum4z9el9Q&s",
        description: "Editor video online con sottotitoli automatici e strumenti AI.",
        tags: [ "Video", "Editing" ],
        pricing: "Freemium",
        addedAt: "2025-01-06T09:40:00Z",
        popularity: 87,
        categorySlug: "video",
        strengths: [ "Editor online semplice", "Sottotitoli automatici", "Buono per team e creator" ]
    }, {
        id: 26,
        name: "InVideo AI",
        url: "https://invideo.io/ai",
        logo: "https://img.icons8.com/fluent/1200/invideo-ai.jpg",
        description: "Crea video completi partendo da uno script di testo.",
        tags: [ "Video", "Marketing" ],
        pricing: "Freemium",
        addedAt: "2024-12-05T12:35:00Z",
        popularity: 85,
        categorySlug: "video",
        strengths: [ "Video da script in pochi passaggi", "Ideale per contenuti marketing", "Template utili per velocizzare" ]
    }, {
        id: 27,
        name: "ElevenLabs",
        url: "https://elevenlabs.io",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DN9iXZQW_moadvhVIxjKxgJeGY3HVUGS1A&s",
        description: "Sintesi vocale ultra realistica in molte lingue.",
        tags: [ "Audio", "Voce" ],
        pricing: "Freemium",
        addedAt: "2024-11-18T10:00:00Z",
        popularity: 95,
        categorySlug: "audio",
        strengths: [ "Voci molto realistiche", "Utile per doppiaggio e narratori", "Buon supporto multilingua" ]
    }, {
        id: 28,
        name: "Auphonic",
        url: "https://auphonic.com",
        logo: "https://auphonic.com/media/pics/AuphonicLogo.jpg",
        description: "Mastering automatico, normalizzazione e riduzione rumore per podcast.",
        tags: [ "Audio", "Podcast" ],
        pricing: "Freemium",
        addedAt: "2024-12-20T09:30:00Z",
        popularity: 87,
        categorySlug: "audio",
        strengths: [ "Mastering automatico per podcast", "Normalizzazione livelli affidabile", "Riduzione rumore in pochi click" ]
    }, {
        id: 29,
        name: "Riverside.fm",
        url: "https://riverside.fm",
        logo: "https://asset.brandfetch.io/id5Q-LMzPI/idugjsIuYw.jpeg",
        description: "Registrazione remota in alta qualità con trascrizione AI.",
        tags: [ "Audio", "Podcast", "Registrazione" ],
        pricing: "Freemium",
        addedAt: "2024-11-10T14:10:00Z",
        popularity: 88,
        categorySlug: "audio",
        strengths: [ "Registrazione remota in alta qualità", "Ottimo per interviste e podcast", "Trascrizione per velocizzare l’editing" ]
    }, {
        id: 30,
        name: "Cleanvoice AI",
        url: "https://cleanvoice.ai",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHDg59kv6WZtsdKjRIENWUlFP7lh2mmH-9kg&s",
        description: "Rimuove filler, respiri e rumori dai file audio.",
        tags: [ "Audio", "Pulizia" ],
        pricing: "A pagamento",
        addedAt: "2024-10-21T08:45:00Z",
        popularity: 84,
        categorySlug: "audio",
        strengths: [ "Rimozione automatica filler e respiri", "Pulizia audio rapida", "Ideale per podcast e voiceover" ]
    }, {
        id: 31,
        name: "Krisp",
        url: "https://krisp.ai",
        logo: "https://krisp.ai/blog/wp-content/uploads/2023/10/cropped-Favicon.png",
        description: "Riduzione del rumore in tempo reale per call e registrazioni.",
        tags: [ "Audio", "Noise cancelling" ],
        pricing: "Freemium",
        addedAt: "2024-12-02T11:25:00Z",
        popularity: 86,
        categorySlug: "audio",
        strengths: [ "Noise cancelling in tempo reale", "Ottimo per call e meeting", "Setup semplice su più app" ]
    }, {
        id: 32,
        name: "Murf.ai",
        url: "https://murf.ai",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlhUOGbO06Wk2zbWc2nbTu_M45KYa2Jf03ZQ&s",
        description: "Voce narrante AI per video, e-learning e presentazioni.",
        tags: [ "Audio", "Voce" ],
        pricing: "A pagamento",
        addedAt: "2024-11-27T13:50:00Z",
        popularity: 89,
        categorySlug: "audio",
        strengths: [ "Voce narrante per e-learning e video", "Interfaccia orientata ai creator", "Buon controllo su tono e stile" ]
    }, {
        id: 33,
        name: "WellSaid Labs",
        url: "https://www.wellsaid.io/",
        logo: "https://avatars.githubusercontent.com/u/51676885?s=280&v=4",
        description: "Piattaforma di sintesi vocale e generazione vocale basata su IA che offre voci ultra-realistiche e di qualità umana per narrazione, formazione e marketing",
        tags: [ "Audio" ],
        pricing: "A pagamento",
        addedAt: "2026-01-14T15:05:00Z",
        popularity: 88,
        categorySlug: "audio",
        strengths: [ "Voci IA altamente naturali e simili a quelle umane, con tonalità espressive", "Opzioni Studio e API per la creazione di contenuti e l’integrazione", "Strumenti di collaborazione per team ed enterprise con supporto alla conformità" ]
    }, {
        id: 34,
        name: "Adobe Podcast",
        url: "https://podcast.adobe.com",
        logo: "https://cdn-1.webcatalog.io/catalog/adobe-podcast/adobe-podcast-icon-filled-256.webp?v=1759151473794",
        description: "Strumenti AI per pulizia voce, equalizzazione e registrazione via browser.",
        tags: [ "Audio", "Podcast" ],
        pricing: "Freemium",
        addedAt: "2025-01-04T09:55:00Z",
        popularity: 87,
        categorySlug: "audio",
        strengths: [ "Pulizia voce rapida via browser", "Utile per registrazioni e podcast", "Facile per migliorare l’audio parlato" ]
    }, {
        id: 35,
        name: "GitHub Copilot",
        url: "https://github.com/features/copilot",
        logo: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
        description: "Suggerimenti di codice in tempo reale direttamente nell'editor.",
        tags: [ "Coding", "Sviluppo" ],
        pricing: "A pagamento",
        addedAt: "2024-12-01T13:00:00Z",
        popularity: 97,
        categorySlug: "coding",
        strengths: [ "Suggerimenti in-editor molto rapidi", "Aumenta la produttività di sviluppo", "Buona copertura linguaggi comuni" ]
    }, {
        id: 36,
        name: "Cursor",
        url: "https://cursor.sh",
        logo: "https://brandlogos.net/wp-content/uploads/2025/04/cursor_code_editor-logo_brandlogos.net_r1yfy-512x512.png",
        description: "Editor di codice con AI integrata per refactor e debugging.",
        tags: [ "Coding", "IDE" ],
        pricing: "Freemium",
        addedAt: "2025-01-08T16:00:00Z",
        popularity: 92,
        categorySlug: "coding",
        strengths: [ "IDE con AI integrata", "Refactor e debugging assistiti", "Ottimo per iterare velocemente" ]
    }, {
        id: 37,
        name: "Replit Ghostwriter",
        url: "https://replit.com/ghostwriter",
        logo: "https://avatars.githubusercontent.com/u/983194?s=200&v=4",
        description: "Assistente per coding collaborativo nel browser.",
        tags: [ "Coding", "Sviluppo" ],
        pricing: "Freemium",
        addedAt: "2024-11-14T10:20:00Z",
        popularity: 88,
        categorySlug: "coding",
        strengths: [ "Coding direttamente dal browser", "Buono per prototipi e learning", "Collaborazione e condivisione facile" ]
    }, {
        id: 38,
        name: "Windsurf",
        url: "https://windsurf.com/",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAACUCAMAAADIzWmnAAAAZlBMVEX///8LEA8AAAD8/Pzz8/NnZ2d+fn6XmJiMjIze3t4vMTA8PDwABgQHDQy+vr4AAwDFxcXo6Og2NzfOzs5bXFyhoaG4uLjW1tYoKilzc3NOTk6Gh4dAQUFVVlaoqKhiYmIeHx8YGRkN1mjJAAAE6klEQVR4nO2aaZuzOgiGDTpVO6Z7a5fpMv//T57Y1RGSEKPvdT7wfJZyWxCykCQikUgkEolEIpFIJBKJRCKRSCQSif63StO+dmlf05c599nsfFv28LDe/gDAbbLoYWycLvLG/MCkLFfwFfx3lBMNoJWeAxx3ocZJsv6Cxhz2GdPddwWXQB87bTw8ZFgPTE9vbeFhDlM+o4YyDBEq9ZGGTRBkun29YAijgq8QL2vdRmx8nUIYZ+8YBDEqyPk+simojkKSZQlz1YtRQ812ckGIqgpIlsnHPIxRwZEdbfw3GvMz1zrdV30ZFUyYTmqtMaOCgmk+q3RvRg0z3vNEqJto/zKTJW+ZhzKanOJV8pxkVKB57ooYRsVsNxZGbgGKY9RzVlezMepqMT4js4LYGE335SwvIhkVbGIYFRz+AaOCbQyjBkayRDNWyp9TdkY1n/oLUDSjgu8YRk6yxDMyKoiLkZEsAzBq5Ws3TkbtbTcDMJpoe+ycjGZx4TEfgtG0mxhGb7IMwqg8FcTDqGD9LxhXznbjZTw6200vxuzcdQpX1+LCx+hZibYZ59y9K+HUuT15PV7BXVXX2LMSfTI2O3PwfmAfQReyujkqyIMR4Haa1fXscMOU86kj2sXTfF8sypK/G61/u25cO+Y7I6wuz3xIL3scB8dK9M7Y43CjwF7se9mGEY6tP3r90zXXjmRpfMG1xyER+mwce1nD2Pl0lwSkFcIwBp5rPFVCd68HP7bfaRg7L7DG5tavoQDHCzi1xdG2bUZzwKsbIlls0S4g7OSlpQn2YqkghhF1kuyKo21pN4Yx7ADso9YpzFO2ApsDUVpqIlnob7uAc79QJ+3TrLeXCeklhysBz06Wgn14i5WiaFsqSE4eBKZf2JysgYXl1VlarlC7+aWiQjMm5RQ1gikFE8VIVZAj6YQ+UN0R7YZ47BTFaMyRF6LdTGyHvqxoZ19xjNkRRVuhOrE82hiX32iRh08uyn0cI7W4UN1ndmA9PF8QBaj7jKmucYxUBelEO53aGRntZmk6YSRjusE59bfdHMBxCZGh0qD/Hnykph/FMpp06babqp342aFZWdkvSnCyzNvvWDYtM5qRqCAaTq8PZ3Ffw7kuc/C+o4Li9eHs7mu4eMYErQ4MpNrs6nqRr/Rjne+6cEJLSWP+u9mt61mxf+xJBmDE7eZ+J3jX47N1Mi731CbsrvnTPJ7RRJu622jJfXGHS0PXfABGot2EMDZf/viMKRHtAMase+M5BiPRL0IYfckyDKMnp7wXybjdjMCY4goSwpjhU4HhGU1bdeSU/0Ie725GYEwuDi+MoQHnuf5QjHhxEcSIV6IjMCapskabM3yBDz5GYHRUENaAiL00DMhInFyEMOK97BiMma0A8QZtSmrsYmhGYi8bwkisREdgtE4lMAeWLIsL9nAJS/jG4eHkxPsj8NHpw5w7wcIT3S/YM1X02iR4AM8jqoLom/siqyVqJVqxJhoClOLdTcBIVJIS7cZ3HRmuGm9PPPeBf7RQ3Wj3PQx3CR2dhqV8d6jKdSvSX3lnHjNoUrIpQPqP+anPtYdXF/Vxw5/yfSktoG3e90rBp/ox4Nvsks895oNn57f5lTVJ1Uvp+j4oPZ3segUqW0z2xvy7mI0S57cGmFcfskuLRCKRSCQSiUQikUgkEolEIpFIJBpf/wFVlzYI66/tSAAAAABJRU5ErkJggg==",
        description: "Completamento di codice AI gratuito per molti linguaggi.",
        tags: [ "Coding", "Autocomplete" ],
        pricing: "Freemium",
        addedAt: "2024-12-06T09:35:00Z",
        popularity: 90,
        categorySlug: "coding",
        strengths: [ "Gratis e facile da provare", "Autocomplete multi-linguaggio", "Buono per uso quotidiano" ]
    }, {
        id: 39,
        name: "Tabnine",
        url: "https://www.tabnine.com",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdaYhnzyDUt2QQbPzG7yBwahCXiHQA67RUfw&s",
        description: "Completamento predittivo di codice in locale o cloud.",
        tags: [ "Coding", "Autocomplete" ],
        pricing: "Freemium",
        addedAt: "2024-10-31T12:15:00Z",
        popularity: 85,
        categorySlug: "coding",
        strengths: [ "Opzioni per privacy e controllo", "Autocomplete stabile e predittivo", "Adatto anche a team" ]
    }, {
        id: 40,
        name: "Amazon CodeWhisperer",
        url: "https://aws.amazon.com/codewhisperer/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        description: "Suggerimenti di codice ottimizzati per servizi AWS.",
        tags: [ "Coding", "Cloud" ],
        pricing: "Freemium",
        addedAt: "2024-11-22T11:05:00Z",
        popularity: 86,
        categorySlug: "coding",
        strengths: [ "Ottimo se lavori su AWS", "Suggerimenti contestuali per cloud", "Utile per accelerare prototipi" ]
    }, {
        id: 41,
        name: "Sourcegraph Cody",
        url: "https://sourcegraph.com/cody",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTck5obquUuv49Mu1HAmNPcWksB_GAVxg7gCg&s",
        description: "Assistente AI per capire codebase aziendali complesse.",
        tags: [ "Coding", "Documentazione" ],
        pricing: "Freemium",
        addedAt: "2024-12-19T14:40:00Z",
        popularity: 89,
        categorySlug: "coding",
        strengths: [ "Ottimo per codebase grandi", "Aiuta a capire e navigare il codice", "Utile per documentazione e onboarding" ]
    }, {
        id: 42,
        name: "CodeGeeX",
        url: "https://codegeex.cn",
        logo: "https://aminer.gallerycdn.vsassets.io/extensions/aminer/codegeex/2.27.6/1756716402649/Microsoft.VisualStudio.Services.Icons.Default",
        description: "Modello open-source per generazione di codice multi-linguaggio.",
        tags: [ "Coding", "Open Source" ],
        pricing: "Gratis",
        addedAt: "2024-10-18T07:55:00Z",
        popularity: 82,
        categorySlug: "coding",
        strengths: [ "Open-source e sperimentabile", "Generazione multi-linguaggio", "Buono per test e prototipi" ]
    }, {
        id: 43,
        name: "Notion AI",
        url: "https://www.notion.so/product/ai",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
        description: "AI integrata in Notion per note, documenti e wiki.",
        tags: [ "Produttività", "Documenti" ],
        pricing: "Freemium",
        addedAt: "2024-12-18T09:00:00Z",
        popularity: 93,
        categorySlug: "produttivita",
        strengths: [ "Ottimo per documenti e knowledge base", "Sintesi e scrittura dentro Notion", "Adatto a team e progetti" ]
    }, {
        id: 44,
        name: "Zapier AI",
        url: "https://zapier.com/ai",
        logo: "https://images.seeklogo.com/logo-png/27/2/zapier-logo-png_seeklogo-274108.png",
        description: "Automazioni e workflow potenziati dall'intelligenza artificiale.",
        tags: [ "Produttività", "Automazioni" ],
        pricing: "A pagamento",
        addedAt: "2025-01-14T12:00:00Z",
        popularity: 85,
        categorySlug: "produttivita",
        strengths: [ "Automazioni potenti senza codice", "Moltissime integrazioni", "Ottimo per processi ripetitivi" ]
    }, {
        id: 45,
        name: "Airtable AI",
        url: "https://www.airtable.com/ai",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-airtable-logo-icon-svg-download-png-1254387.png",
        description: "Funzioni AI integrate nei database e nelle viste Airtable.",
        tags: [ "Produttività", "Database" ],
        pricing: "A pagamento",
        addedAt: "2024-12-09T10:45:00Z",
        popularity: 84,
        categorySlug: "produttivita",
        strengths: [ "Database flessibili per team", "AI per analisi e automazioni", "Ottimo per workflow strutturati" ]
    }, {
        id: 46,
        name: "ClickUp AI",
        url: "https://clickup.com/ai",
        logo: "https://clickup.com/images/for-se-page/clickup.png",
        description: "Scrittura di task, documenti e riepiloghi automatici nei progetti.",
        tags: [ "Produttività", "Project management" ],
        pricing: "A pagamento",
        addedAt: "2024-11-29T09:15:00Z",
        popularity: 86,
        categorySlug: "produttivita",
        strengths: [ "Project management completo", "AI per task e riepiloghi", "Utile per team e operatività" ]
    }, {
        id: 47,
        name: "Mem",
        url: "https://mem.ai",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIENIvq-xVxhodKhvTPPMiW8bc2_OKpN3MtQ&s",
        description: "Secondo cervello AI per note, appunti e conoscenza personale.",
        tags: [ "Produttività", "Note" ],
        pricing: "Freemium",
        addedAt: "2024-11-05T16:25:00Z",
        popularity: 83,
        categorySlug: "produttivita",
        strengths: [ "Note e conoscenza personale", "Recupero informazioni più facile", "Buono per “second brain”" ]
    }, {
        id: 48,
        name: "Motion",
        url: "https://www.usemotion.com",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVRkflzwFFXIJeJpFQsJ0S3FzG8Ujf-8ptkQ&s",
        description: "Planner intelligente che riordina automaticamente il calendario.",
        tags: [ "Produttività", "Calendario" ],
        pricing: "A pagamento",
        addedAt: "2024-12-21T08:05:00Z",
        popularity: 87,
        categorySlug: "produttivita",
        strengths: [ "Pianificazione automatica del tempo", "Ottimo per gestire priorità", "Riduce stress da calendario" ]
    }, {
        id: 49,
        name: "Tome",
        url: "https://ppt.ai/tome-ai-ppt",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNZTqOC7-9CBwLUlAytVXeoXYB878n5zAAg&s",
        description: "Presentazioni generate da AI a partire da prompt di testo.",
        tags: [ "Produttività", "Presentazioni" ],
        pricing: "Freemium",
        addedAt: "2024-11-16T13:20:00Z",
        popularity: 84,
        categorySlug: "produttivita",
        strengths: [ "Presentazioni rapide da prompt", "Buono per storytelling e pitch", "Design pulito e moderno" ]
    }, {
        id: 50,
        name: "Grammarly",
        url: "https://www.grammarly.com",
        logo: "https://static-web.grammarly.com/1e6ajr2k4140/1CecYCG7ZvI1CnYmWsz6cX/85fab85e420035e4a2ef28e779035e36/Frame_31613445.png?w=810",
        description: "Controllo grammaticale e stile con AI integrato nei browser.",
        tags: [ "Scrittura", "Produttività" ],
        pricing: "Freemium",
        addedAt: "2024-10-26T09:50:00Z",
        popularity: 92,
        categorySlug: "produttivita",
        strengths: [ "Correzione grammaticale e stile", "Suggerimenti su tono e chiarezza", "Integrazione comoda in browser e app" ]
    } ];
    document.addEventListener("DOMContentLoaded", () => {
        initHomepagePopular();
        initCategoryPage();
        initAllToolsPage();
        initComparePage();
    });
    function initHomepagePopular() {
        const isHomepage = document.querySelector(".homepage");
        if (!isHomepage) return;
        const toolsEl = document.getElementById("toolsList");
        if (!toolsEl) return;
        const TOP_N = 8;
        const popular = [ ...TOOLS ].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, TOP_N);
        toolsEl.innerHTML = popular.map(t => `\n    <article class="tool-card">\n      <img src="${t.logo}" alt="${t.name}" loading="lazy">\n      <div>\n        <h3 style="margin:0 0 6px">\n          <a href="${t.url}" target="_blank" rel="sponsored noopener">${t.name}</a>\n        </h3>\n        <p class="muted" style="margin:0 0 6px">${t.description || ""}</p>\n        <div>${(t.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>\n      </div>\n      <div class="actions">\n        <a class="pill" href="${t.url}" target="_blank" rel="sponsored noopener">Visita</a>\n        <a class="pill secondary" href="/confronta.html?id=${t.id}">Confronta</a>\n      </div>\n    </article>\n  `).join("");
    }
    function initAllToolsPage() {
        const root = document.querySelector(".tools-page");
        if (!root) return;
        const listEl = document.getElementById("toolsList");
        const qEl = document.getElementById("q");
        const catEl = document.getElementById("category");
        const pricingEl = document.getElementById("pricing");
        const loadMoreBtn = document.getElementById("loadMoreAll");
        const filterBtn = document.getElementById("filterBtn");
        if (!listEl || !qEl || !catEl || !pricingEl) {
            console.warn("[StrumentiAI] Missing tools-page elements.");
            return;
        }
        const STATE = {
            visible: 24,
            step: 24
        };
        const PRICE_MAP = {
            free: "Gratis",
            freemium: "Freemium",
            paid: "A pagamento"
        };
        const toTokens = s => (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").split(/\s+/).filter(Boolean);
        const debounce = (fn, ms = 180) => {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn(...args), ms);
            };
        };
        function getFiltered() {
            const tokens = toTokens(qEl.value.trim());
            const cat = catEl.value;
            const pricingKey = pricingEl.value;
            const pricingLabel = pricingKey ? PRICE_MAP[pricingKey] : "";
            let filtered = TOOLS.filter(t => {
                const hay = (t.name + " " + (t.description || "") + " " + (t.tags || []).join(" ")).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
                const qOK = !tokens.length || tokens.every(tok => hay.includes(tok));
                const cOK = !cat || t.categorySlug === cat;
                const pOK = !pricingLabel || t.pricing === pricingLabel;
                return qOK && cOK && pOK;
            });
            filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            return filtered;
        }
        function render() {
            const filtered = getFiltered();
            const slice = filtered.slice(0, STATE.visible);
            listEl.innerHTML = slice.map(t => `\n      <article class="tool-card">\n        <img src="${t.logo}" alt="${t.name}" loading="lazy">\n        <div>\n          <h3 style="margin:0 0 6px">\n            <a href="${t.url}" target="_blank" rel="sponsored noopener">${t.name}</a>\n          </h3>\n          <p class="muted" style="margin:0 0 6px">${t.description || ""}</p>\n          <div>${(t.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>\n        </div>\n        <div class="actions">\n          <a class="pill" href="${t.url}" target="_blank" rel="sponsored noopener">Visita</a>\n          <a class="pill secondary" href="/confronta.html?id=${t.id}">Confronta</a>\n        </div>\n      </article>\n    `).join("");
            if (loadMoreBtn) {
                loadMoreBtn.style.display = slice.length < filtered.length ? "" : "none";
                loadMoreBtn.textContent = `Carica altri (${filtered.length - slice.length})`;
            }
        }
        function resetAndRender() {
            STATE.visible = 24;
            render();
        }
        qEl.addEventListener("input", debounce(resetAndRender, 180));
        catEl.addEventListener("change", resetAndRender);
        pricingEl.addEventListener("change", resetAndRender);
        filterBtn?.addEventListener("click", e => {
            e.preventDefault();
            resetAndRender();
        });
        loadMoreBtn?.addEventListener("click", () => {
            STATE.visible += STATE.step;
            render();
        });
        render();
    }
    function initCategoryPage() {
        const elList = document.getElementById("catTools");
        const elQ = document.getElementById("qCat");
        const elSort = document.getElementById("sortCat");
        const elCatName = document.getElementById("catName");
        const elCatCount = document.getElementById("catCount");
        const elResultCount = document.getElementById("resultCount");
        const elEmpty = document.getElementById("emptyState");
        const elPagination = document.getElementById("pagination");
        const elPages = document.getElementById("pages");
        if (!elList) return;
        elList.classList.add("grid-view");
        const CATEGORIES = [ {
            id: "chatbot",
            name: "Chatbot",
            href: "/categorie/chatbot/",
            desc: "Assistenti conversazionali e agenti AI.",
            count: 124,
            cover: "https://picsum.photos/seed/cat1/128/128",
            createdAt: "2024-11-01"
        }, {
            id: "immagine",
            name: "Immagine",
            href: "/categorie/immagine/",
            desc: "Generazione, editing e upsccaling di immagini.",
            count: 178,
            cover: "https://picsum.photos/seed/cat2/128/128",
            createdAt: "2025-01-12"
        }, {
            id: "video",
            name: "Video",
            href: "/categorie/video/",
            desc: "Generazione video, editing e sottotitoli AI.",
            count: 86,
            cover: "https://picsum.photos/seed/cat3/128/128",
            createdAt: "2025-03-22"
        }, {
            id: "audio",
            name: "Audio",
            href: "/categorie/audio/",
            desc: "Sintesi vocale, riconoscimento e mastering AI.",
            count: 92,
            cover: "https://picsum.photos/seed/cat4/128/128",
            createdAt: "2025-02-05"
        }, {
            id: "coding",
            name: "Coding",
            href: "/categorie/coding/",
            desc: "Assistenti di codice, refactor e test.",
            count: 133,
            cover: "https://picsum.photos/seed/cat5/128/128",
            createdAt: "2024-12-09"
        }, {
            id: "produttivita",
            name: "Produttività",
            href: "/categorie/produttivita/",
            desc: "Organizzazione, automazioni e strumenti office.",
            count: 141,
            cover: "https://picsum.photos/seed/cat6/128/128",
            createdAt: "2025-04-18"
        } ];
        const STATE = {
            q: "",
            sort: "name",
            page: 1,
            perPage: 24
        };
        const formatCount = n => new Intl.NumberFormat("it-IT").format(n);
        const applySearch = (data, q) => {
            if (!q) return data;
            const s = q.trim().toLowerCase();
            return data.filter(c => c.name.toLowerCase().includes(s) || c.desc && c.desc.toLowerCase().includes(s));
        };
        const applySort = (data, sort) => {
            const arr = [ ...data ];
            if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name, "it", {
                sensitivity: "base"
            })); else if (sort === "pop") arr.sort((a, b) => (b.count || 0) - (a.count || 0)); else if (sort === "new") arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            return arr;
        };
        const paginate = (data, page, perPage) => {
            const total = data.length;
            const pages = Math.max(1, Math.ceil(total / perPage));
            const p = Math.min(Math.max(1, page), pages);
            const start = (p - 1) * perPage;
            return {
                total,
                pages,
                page: p,
                items: data.slice(start, start + perPage)
            };
        };
        function renderPagination(pages, current) {
            if (!elPagination || !elPages) return;
            if (pages <= 1) {
                elPagination.style.display = "none";
                elPages.innerHTML = "";
                return;
            }
            elPagination.style.display = "";
            let html = "";
            for (let i = 1; i <= pages; i++) html += `<a class="page ${i === current ? "current" : ""}" href="#" data-page="${i}" aria-current="${i === current ? "page" : "false"}">${i}</a>`;
            elPages.innerHTML = html;
        }
        function renderList(items) {
            if (!items.length) {
                elList.innerHTML = "";
                if (elEmpty) elEmpty.style.display = "";
                if (elResultCount) elResultCount.textContent = "Mostrate 0";
                return;
            }
            if (elEmpty) elEmpty.style.display = "none";
            elList.innerHTML = items.map(c => `\n      <article class="tool-card">\n        <img src="${c.cover}" alt="${c.name}" loading="lazy">\n        <div>\n          <h3 style="margin:0 0 6px"><a href="${c.href}">${c.name}</a></h3>\n          <p class="muted" style="margin:0 0 6px">${c.desc || ""}</p>\n          <div><span class="tag">Strumenti: ${formatCount(c.count || 0)}</span></div>\n        </div>\n        <div class="actions">\n          <a class="pill" href="${c.href}">Apri</a>\n        </div>\n      </article>\n    `).join("");
            if (elResultCount) elResultCount.textContent = `Mostrate ${items.length}`;
        }
        function updateHeaderCount(total) {
            if (elCatName) elCatName.textContent = "Categorie";
            if (elCatCount) elCatCount.textContent = `${formatCount(total)} categorie`;
        }
        function render() {
            let data = [ ...CATEGORIES ];
            updateHeaderCount(data.length);
            data = applySearch(data, STATE.q);
            data = applySort(data, STATE.sort);
            const {pages, page, items} = paginate(data, STATE.page, STATE.perPage);
            STATE.page = page;
            renderList(items);
            renderPagination(pages, page);
        }
        elQ?.addEventListener("input", e => {
            STATE.q = e.target.value || "";
            STATE.page = 1;
            render();
        });
        elSort?.addEventListener("change", e => {
            STATE.sort = e.target.value;
            STATE.page = 1;
            render();
        });
        elPagination?.addEventListener("click", e => {
            const a = e.target.closest("a.page");
            if (!a) return;
            e.preventDefault();
            const val = a.getAttribute("data-page");
            if (val === "prev") STATE.page = Math.max(1, STATE.page - 1); else if (val === "next") STATE.page = STATE.page + 1; else STATE.page = parseInt(val, 10) || 1;
            render();
        });
        render();
    }
    (function() {
        const root = document.getElementById("catPage");
        if (!root) return;
        const slug = (root.getAttribute("data-slug") || (location.pathname.match(/\/categoria\/([^\/]+)/) || [])[1] || "").toLowerCase();
        const CATEGORY_META = {
            chatbot: {
                title: "Chatbot",
                lead: "Assistenti conversazionali e agenti AI."
            },
            immagine: {
                title: "Immagine",
                lead: "Generazione, editing e upscaling di immagini con AI."
            },
            video: {
                title: "Video",
                lead: "Generazione, editing e sottotitoli video AI."
            },
            audio: {
                title: "Audio",
                lead: "Sintesi vocale, riconoscimento e strumenti per podcast."
            },
            coding: {
                title: "Coding",
                lead: "Assistenti di codice, refactor e test automatizzati."
            },
            produttivita: {
                title: "Produttività",
                lead: "Organizzazione, automazioni e strumenti da ufficio."
            }
        };
        const els = {
            title: document.getElementById("catTitle"),
            lead: document.getElementById("catLead"),
            crumb: document.getElementById("crumbCat"),
            badge: document.getElementById("catBadge"),
            q: document.getElementById("qTool"),
            pricing: document.getElementById("pricingTool"),
            sort: document.getElementById("sortTool"),
            list: document.getElementById("toolsList"),
            empty: document.getElementById("emptyState"),
            resultCount: document.getElementById("resultCount"),
            pagination: document.getElementById("pagination"),
            pages: document.getElementById("pages"),
            chips: document.getElementById("tagChips"),
            onlyFree: document.getElementById("onlyFree"),
            newOnly: document.getElementById("newOnly"),
            reset: document.getElementById("resetFilters")
        };
        if (!slug || !CATEGORY_META[slug]) {
            if (els.title) els.title.textContent = "Categoria";
            if (els.lead) els.lead.textContent = "Categoria non trovata.";
            if (els.list) els.list.innerHTML = "";
            if (els.empty) els.empty.style.display = "";
            return;
        }
        const meta = CATEGORY_META[slug];
        document.title = `${meta.title} · Strumenti AI`;
        if (els.title) els.title.textContent = meta.title;
        if (els.lead) els.lead.textContent = meta.lead;
        if (els.crumb) els.crumb.textContent = meta.title;
        els.list?.classList.add("grid-view");
        const STATE = {
            q: "",
            pricing: "",
            sort: "new",
            page: 1,
            perPage: 24,
            tags: new Set
        };
        const toTokens = s => (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").split(/\s+/).filter(Boolean);
        const isNew = (iso, days = 14) => (Date.now() - new Date(iso).getTime()) / 864e5 <= days;
        const formatNum = n => new Intl.NumberFormat("it-IT").format(n);
        const ALL = TOOLS.filter(t => t.categorySlug === slug);
        const tagCounts = {};
        ALL.forEach(t => (t.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }));
        const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag]) => tag);
        if (els.chips && topTags.length) {
            els.chips.innerHTML = topTags.map(tag => `<button class="chip" data-tag="${tag}">${tag}</button>`).join("");
            els.chips.addEventListener("click", e => {
                const btn = e.target.closest(".chip");
                if (!btn) return;
                const tag = btn.dataset.tag;
                if (STATE.tags.has(tag)) {
                    STATE.tags.delete(tag);
                    btn.classList.remove("is-active");
                } else {
                    STATE.tags.add(tag);
                    btn.classList.add("is-active");
                }
                STATE.page = 1;
                render();
            });
        }
        function applyFilters(list) {
            const qTokens = toTokens(STATE.q);
            return list.filter(t => {
                const hay = (t.name + " " + t.description + " " + (t.tags || []).join(" ")).toLowerCase();
                const matchesQ = !qTokens.length || qTokens.every(tok => hay.includes(tok));
                const matchesPricing = !STATE.pricing || t.pricing === STATE.pricing;
                const matchesTags = !STATE.tags.size || [ ...STATE.tags ].every(tag => (t.tags || []).includes(tag));
                const onlyFreeOK = !els.onlyFree?.checked || t.pricing === "Gratis" || t.pricing === "Free" || t.pricing === "Freemium";
                const newOnlyOK = !els.newOnly?.checked || isNew(t.addedAt);
                return matchesQ && matchesPricing && matchesTags && onlyFreeOK && newOnlyOK;
            });
        }
        function applySort(list) {
            const arr = [ ...list ];
            if (STATE.sort === "new") arr.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)); else if (STATE.sort === "pop") arr.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); else if (STATE.sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name, "it", {
                sensitivity: "base"
            }));
            return arr;
        }
        function paginate(list) {
            const total = list.length;
            const pages = Math.max(1, Math.ceil(total / STATE.perPage));
            const page = Math.min(Math.max(1, STATE.page), pages);
            const start = (page - 1) * STATE.perPage;
            return {
                total,
                pages,
                page,
                items: list.slice(start, start + STATE.perPage)
            };
        }
        function renderList(items) {
            if (!els.list) return;
            if (!items.length) {
                els.list.innerHTML = "";
                if (els.empty) els.empty.style.display = "";
                if (els.resultCount) els.resultCount.textContent = "Mostrati 0";
                if (els.badge) els.badge.textContent = `${formatNum(ALL.length)} strumenti`;
                return;
            }
            if (els.empty) els.empty.style.display = "none";
            els.list.innerHTML = items.map(t => `\n      <article class="tool-card">\n        <img src="${t.logo}" alt="${t.name}" loading="lazy">\n        <div>\n          <h3 style="margin:0 0 6px;display:flex;align-items:center;gap:6px">\n            <a href="${t.url}" target="_blank" rel="sponsored noopener">${t.name}</a>\n            ${isNew(t.addedAt) ? '<span class="tag">Nuovo</span>' : ""}\n          </h3>\n          <p class="muted" style="margin:0 0 6px">${t.description || ""}</p>\n          <div>${(t.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>\n        </div>\n        <div class="actions">\n          <a class="pill" href="${t.url}" target="_blank" rel="sponsored noopener">Visita</a>\n          <a class="pill secondary" href="/confronta.html?id=${t.id}">Confronta</a>\n        </div>\n      </article>\n    `).join("");
            if (els.resultCount) els.resultCount.textContent = `Mostrati ${items.length}`;
            if (els.badge) els.badge.textContent = `${formatNum(ALL.length)} strumenti`;
        }
        function renderPagination(pages, current) {
            if (!els.pagination || !els.pages) return;
            if (pages <= 1) {
                els.pagination.style.display = "none";
                els.pages.innerHTML = "";
                return;
            }
            els.pagination.style.display = "";
            let html = "";
            for (let i = 1; i <= pages; i++) html += `<a class="page ${i === current ? "current" : ""}" href="#" data-page="${i}" aria-current="${i === current ? "page" : "false"}">${i}</a>`;
            els.pages.innerHTML = html;
        }
        function render() {
            let list = applyFilters(ALL);
            list = applySort(list);
            const {pages, page, items} = paginate(list);
            STATE.page = page;
            renderList(items);
            renderPagination(pages, page);
        }
        els.q?.addEventListener("input", e => {
            STATE.q = e.target.value;
            STATE.page = 1;
            render();
        });
        els.pricing?.addEventListener("change", e => {
            STATE.pricing = e.target.value;
            STATE.page = 1;
            render();
        });
        els.sort?.addEventListener("change", e => {
            STATE.sort = e.target.value;
            STATE.page = 1;
            render();
        });
        els.onlyFree?.addEventListener("change", () => {
            STATE.page = 1;
            render();
        });
        els.newOnly?.addEventListener("change", () => {
            STATE.page = 1;
            render();
        });
        els.reset?.addEventListener("click", () => {
            STATE.q = "";
            STATE.pricing = "";
            STATE.tags.clear();
            STATE.page = 1;
            STATE.sort = "new";
            if (els.q) els.q.value = "";
            if (els.pricing) els.pricing.value = "";
            if (els.sort) els.sort.value = "new";
            if (els.onlyFree) els.onlyFree.checked = false;
            if (els.newOnly) els.newOnly.checked = false;
            els.chips?.querySelectorAll(".chip.is-active")?.forEach(ch => ch.classList.remove("is-active"));
            render();
        });
        els.pagination?.addEventListener("click", e => {
            const a = e.target.closest("a.page");
            if (!a) return;
            e.preventDefault();
            const val = a.dataset.page;
            if (val === "prev") STATE.page = Math.max(1, STATE.page - 1); else if (val === "next") STATE.page = STATE.page + 1; else STATE.page = parseInt(val, 10) || 1;
            render();
        });
        render();
    })();
    document.addEventListener("DOMContentLoaded", () => {
        initHomepagePopular();
        initCategoryPage();
        initAllToolsPage();
        initComparePage();
    });
    function initComparePage() {
        const titleEl = document.getElementById("toolTitle");
        const strengthsEl = document.getElementById("toolStrengths");
        if (!titleEl) return;
        const params = new URLSearchParams(location.search);
        const id = Number(params.get("id"));
        const tool = TOOLS.find(t => t.id === id);
        if (!tool) {
            titleEl.textContent = "Strumento non trovato";
            const bc = document.getElementById("bc-current");
            if (bc) bc.textContent = "Non trovato";
            return;
        }
        const bcCurrent = document.getElementById("bc-current");
        const subtitleEl = document.getElementById("toolSubtitle");
        const chipsEl = document.getElementById("toolChips");
        const logoEl = document.getElementById("toolLogo");
        const descEl = document.getElementById("toolDesc");
        const infoEl = document.getElementById("toolInfo");
        const visitBtn = document.getElementById("visitBtn");
        titleEl.textContent = tool.name;
        if (bcCurrent) bcCurrent.textContent = tool.name;
        if (subtitleEl) subtitleEl.textContent = tool.description || "";
        if (logoEl) {
            logoEl.src = tool.logo;
            logoEl.alt = tool.name;
        }
        if (descEl) descEl.textContent = tool.description || "";
        if (chipsEl) chipsEl.innerHTML = (tool.tags || []).map(tag => `<span class="chip">${tag}</span>`).join("");
        if (visitBtn) {
            visitBtn.href = tool.url;
            visitBtn.textContent = `Visita ${tool.name}`;
        }
        if (infoEl) infoEl.innerHTML = `\n      <li><strong>Prezzo:</strong> ${tool.pricing || "—"}</li>\n      <li><strong>Categoria:</strong> ${tool.categorySlug || "—"}</li>\n    `;
        if (strengthsEl) {
            const strengths = tool.strengths || [];
            strengthsEl.innerHTML = strengths.length ? strengths.map(s => `<li>${escapeHtml(s)}</li>`).join("") : `<li>Non disponibili</li>`;
        }
        renderAlternatives(tool);
    }
    function renderAlternatives(tool) {
        const altsEl = document.getElementById("alts");
        const emptyEl = document.getElementById("altsEmpty");
        const viewAllCat = document.getElementById("viewAllCat");
        if (!altsEl) return;
        const alts = TOOLS.filter(t => t.categorySlug === tool.categorySlug && t.id !== tool.id).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 8);
        if (!alts.length) {
            altsEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "";
            return;
        }
        if (emptyEl) emptyEl.style.display = "none";
        altsEl.innerHTML = alts.map(t => `\n    <article class="tool-card">\n      <img src="${t.logo}" alt="${t.name}" loading="lazy">\n      <div>\n        <h3 style="margin:0 0 6px">\n          <a href="/confronta.html?id=${t.id}">${t.name}</a>\n        </h3>\n        <p class="muted" style="margin:0 0 6px">${t.description || ""}</p>\n        <div>${(t.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>\n      </div>\n      <div class="actions">\n        <a class="pill" href="${t.url}" target="_blank" rel="sponsored noopener">Visita</a>\n        <a class="pill secondary" href="/confronta.html?id=${t.id}">Confronta</a>\n      </div>\n    </article>\n  `).join("");
        if (viewAllCat) viewAllCat.href = `/categoria/${tool.categorySlug}/`;
    }
    function escapeHtml(str) {
        return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    }
    window["FLS"] = true;
    menuInit();
    spollers();
})();