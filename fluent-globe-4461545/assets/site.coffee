### 
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
Table of Contents
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    
    - Theme View
        - Header View
            - Navigation View
                - Mobile navigation View
                - Mega navigation View
        - Template View
            - QuickShop View
            - Index View
                - Slideshow View
            - Collection View
            - List Collections View
            - Product View
            - Cart View
            - Page View
            - The404View
            - Blog View

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
###


$ ->
    new ThemeView()

Window = $(window)
Body   = $('body')
Touch  = $('html').hasClass('touch')



# ----------------------------------------------------- #
class ThemeView extends Backbone.View

    el: Body

    events:
        'focus .field'          : 'removeErrors'

    initialize: ->
        @customerPage   = @$el.attr('class').indexOf('customer') > 0
            
        if navigator.userAgent.indexOf('MSIE 10.0') > 0
            $('html').addClass('ie10')

        if $('html').hasClass('lt-ie10')
            @inputPlaceholderFix()

        new HeaderView()
        new TemplateView()

    removeErrors: (e) ->
        field = ($ e.currentTarget)
        field.removeClass('error')

    inputPlaceholderFix: ->
        placeholders = $('[placeholder]')

        for input in placeholders
            input = ($ input)
            unless input.attr('value').length > 0
                text = input.attr('placeholder')
                input.attr('value', text)
                input.data('original-text', text)

        placeholders.focus ->
            input = $(this)
            if input.val() == input.data('original-text')
                input.val('')

        placeholders.blur ->
            input = $(this)
            if input.val().length is 0
                input.val(input.data('original-text'))


# ----------------------------------------------------- #
class HeaderView extends Backbone.View

    el: $('.main-header')

    events:
        'click .tools .search'                  : 'toggleSearch'
        'blur .search-wrap.full .search-input'  : 'toggleSearch'
        'click .compact .search'                : 'toggleMobileSearch'
        'blur .compact .search-input'           : 'toggleMobileSearch'
        'click .mini-cart-wrap'                 : 'toggleMiniCart'
        'click .mini-cart.active'               : 'stopProp'

    initialize: ->
        @tools              = ($ '.tools')
        @branding           = ($ '.store-title, .logo')
        @searchWrap         = ($ '.search-wrap.full')
        @mobileSearchWrap   = ($ '.search-outer-wrap')
        @searchInput        = ($ '.search-input')
        @miniCart           = ($ '.mini-cart')

        @branding.imagesLoaded =>
            @positionHeaderTools()

        Window.resize =>
            @resize()
            @positionHeaderTools()

        new NavigationView({ el: @$el })

    stopProp: (e) ->
        e.stopPropagation();

    resize: ->
        if Window.width() < 720
            @searchWrap.hide()

    positionHeaderTools: ->
        offset = (@branding.outerHeight() - @tools.height()) / 2
        @tools
            .css
                marginTop: offset + 4
                visibility: 'visible'

        @searchWrap
            .css
                marginTop: offset + 1
                visibility: 'visible'
                'min-width': @tools.outerWidth()

    toggleSearch: ->
        if @searchWrap.hasClass('active')
            @searchWrap.hide().removeClass('active')
            @searchInput.val('')
        else
            @searchWrap.show().addClass('active')
            @searchInput.focus()

            @miniCart.hide().removeClass('active')
            @miniCart.parent().removeClass('active')

        false


    toggleMobileSearch: ->
        if @mobileSearchWrap.hasClass('active')
            @mobileSearchWrap.hide().removeClass('active')
            @searchInput.val('')
        else
            @mobileSearchWrap.show().addClass('active')
            offset =  @mobileSearchWrap.find('.search-wrap').outerHeight() / -2
            @mobileSearchWrap.find('.search-wrap').css marginTop: offset

            @searchInput.focus()
            $('.mobile-dropdown').trigger('close-mobile-nav')

    toggleMiniCart: ->
            button = @miniCart.parent()

            if @miniCart.hasClass('active')
                @miniCart.hide().removeClass('active')
                button.removeClass('active')
            else
                @miniCart.show().addClass('active')
                button.addClass('active')



# ----------------------------------------------------- #
class NavigationView extends Backbone.View

    events:
        'mouseenter .dropdown'      : 'establishTierDirection'
        'mouseleave .dropdown'      : 'replaceTrailingDivider'
        'click .has-mega-nav'       : 'toggleMegaNav'

    initialize: ->
        @navigation         = $('.main-header nav.full')
        @megaNavButton      = @navigation.find('.has-mega-nav')
        @mainMenuNavItems   = @navigation.find('> ul > .nav-item')
        @multiLine          = false

        @requiredRoom = 0
        for navItem in @mainMenuNavItems
            navItem = ($ navItem)
            @requiredRoom += navItem.outerWidth()
        
        new MobileNavigationView()
        new MegaNavigationView()

        @formatFullNavigation()
        Window.resize =>
            @resize()

    replaceTrailingDivider: (e) ->
        previousNavItem = ($ e.currentTarget).prev()
        previousNavItem.removeClass('hide-divider')

    resize: ->
        @formatFullNavigation()

    formatFullNavigation: ->
        availableRoom = @navigation.width()

        if @requiredRoom >= availableRoom
            @navigation.addClass('compress') 
            if @navigation.height() > 100
                @multiLine = true
                @navigation.addClass('multi-line')
            else
                @navigation.removeClass('multi-line')
                @multiLine = false
        else
            @navigation.removeClass('compress')
            @navigation.removeClass('multi-line')
            @multiLine = false

    establishTierDirection: (e) ->
        previousNavItem = ($ e.currentTarget).prev()
        previousNavItem.addClass('hide-divider')

        $('.mega-nav').trigger('dismissMegaNav')

        dropdown                = ($ e.currentTarget)
        children                = dropdown.find('.child')
        secondaryChildren       = children.filter('.secondary')
        tertiaryChildren        = children.filter('.tertiary')
        childWidth              = dropdown.find('.dropdown-wrap').outerWidth()
        positionLeft            = dropdown.position().left
        requiredRoom            = if (tertiaryChildren.length > 0) then (3 * childWidth) else (2 * childWidth)
        availableRoom           = @navigation.width() - positionLeft - dropdown.outerWidth()
        
        if requiredRoom > availableRoom
            children.removeClass('right').addClass('left')
        else
            children.removeClass('left').addClass('right')

    toggleMegaNav: (e) ->
        previousNavItem = @megaNavButton.prev()

        if previousNavItem.hasClass('hide-divider') 
            previousNavItem.removeClass('hide-divider') 
        else 
            previousNavItem.addClass('hide-divider')

        $('.mega-nav').trigger('toggleMegaNav')
        
        false



# ----------------------------------------------------- #
class MobileNavigationView extends Backbone.View

    el: $('.mobile-dropdown')

    events:
        'click .dropdown > a' : 'toggleExpand'
        'close-mobile-nav'    : 'closeMobileNav'

    initialize: ->
        @mobileDropdownButton   = $('.compact .dropdown')
        @mobileDropdown         = $('.mobile-dropdown')

        
        if not Touch
            $('.compact .dropdown').on 'click', =>
                @toggleMobileNav()
        else
            $('.compact .nav-item.dropdown').on 'touchend', =>
                @toggleMobileNav()

    openMobileNav: ->
        @mobileDropdownButton.addClass('active')
        @mobileDropdown.show()

    closeMobileNav: ->
        @mobileDropdownButton.removeClass('active')
        @mobileDropdown.hide()

    toggleMobileNav: ->
        if @mobileDropdownButton.hasClass('active')
            @closeMobileNav()
        else
            @openMobileNav()

    toggleExpand: (e) ->
        button      = ($ e.currentTarget).parent()
        listItem    = button.closest('li.list-item')
        childList   = button.find('> .list')

        listItem.toggleClass('expanded')
        childList.toggle()

        false



# ----------------------------------------------------- #
class MegaNavigationView extends Backbone.View

    el: $('.mega-nav')

    initialize: ->
        @navContainer       = $('nav.full')
        @nav                = $('.mega-nav')
        @megaNavWrap        = @nav.find('.mega-nav-wrap')
        @navTrigger         = ($ '.has-mega-nav')
        @mainList           = ($ '.main-list')
        @expandedList       = ($ '.expanded-list')
        @categoriesList     = ($ '.category-list')
        @backButton         = ($ '.back')

        @setup()

        Window.resize =>
            @resize()

    events:
        'toggleMegaNav'             : 'toggle'
        'dismissMegaNav'            : 'dismiss'
        'click .show-more'          : 'goDeepWithin'
        'click .has-category'       : 'goDeepWithin'
        'click .back'               : 'reset'

    setup: ->
        listCount = @mainList.find('.list').length
        if listCount is 1 then listCount = 'one-col'
        if listCount is 2 then listCount = 'two-col'
        if listCount is 3 then listCount = 'three-col'
        @mainList.find('.list').addClass(listCount)

        @nav.css height: @megaNavWrap.height()

    resize: ->
        if Window.width() < 720
            @dismiss()
        else if @navTrigger.hasClass('active')
            @invoke()

    toggle: ->
        if @navTrigger.hasClass('active') then @dismiss() else @invoke()
        return false

    invoke: ->
        offset = Math.floor(@navContainer.position().top + @navTrigger.position().top + @navTrigger.outerHeight())
        @navTrigger.addClass('active')
        @nav.css 
            top: offset
            display: 'block'

    dismiss: ->
        @navTrigger.removeClass('active')
        @navTrigger.prev().removeClass('hide-divider')
        @nav.css
            display: 'none'

    goDeepWithin: (e) ->
        link               = ($ e.currentTarget)
        origin             = link.closest('ul.mega-nav-list')

        # //////////////////////////////////

        if link.hasClass('show-more')
            list        = link.closest('ul.list-wrap').data('list')
            target      = @expandedList
            targetList  = target.find("li[data-list='#{list}']")

            @categoriesList.hide()
            @expandedList.show().find('.list').removeClass('active')
            target.find('.back').data('target', 'main-list')

        else if link.hasClass('has-category')
            category    = ($ e.currentTarget).data('category')
            target      = @categoriesList
            targetList  = target.find("li[data-category='#{category}']")

            if origin.hasClass('main-list')
                @expandedList.hide()
                @categoriesList.show().find('.list').removeClass('active')
                target.find('.back').data('target', 'main-list')
            else
                @categoriesList.show().find('.list').removeClass('active')
                target.find('.back').data('target', 'expanded-list')

        targetList.addClass('active')

        # //////////////////////////////////

        if target.hasClass('expanded-list')
            target.find('.back').data('origin', 'expanded-list')
        else
            target.find('.back').data('origin', 'category-list')

        # //////////////////////////////////

        @nav.animate
            height: target.height()

        @megaNavWrap.animate
            top: '-=' + origin.height()
        , =>
            target.find('.back').fadeIn(150)
            

        return false

    reset: (e) ->
        backButton = ($ e.currentTarget)
        target = $(".#{backButton.data('target')}")
        origin = $(".#{backButton.data('origin')}")

        backButton.fadeOut(150)

        @nav.animate
            height: target.height()

        @megaNavWrap.animate
            top: '+=' + target.height()

        if backButton.data('origin') is 'category-list'
            backButton.data('target', 'main-list')
            backButton.data('origin', 'expanded-list')



# ----------------------------------------------------- #
class TemplateView extends Backbone.View 
    
    el: Body

    initialize: ->

        if Body.hasClass('template-index')              then new IndexView({ el: @$el })
        if Body.hasClass('template-collection')         then new CollectionView({ el: @$el })
        if Body.hasClass('template-list-collections')   then new ListCollectionsView({ el: @$el })
        if Body.hasClass('template-product')            then new ProductView({ el: @$el })
        if Body.hasClass('template-cart')               then new CartView({ el: @$el })

        if Body.hasClass('template-index') || Body.hasClass('template-collection') || Body.hasClass('template-product') || Body.hasClass('template-blog') || Body.hasClass('template-article') || Body.hasClass('template-page') || Body.hasClass('template-search')
            new RTEView({ el: @$el })

        if Body.hasClass('template-index') || Body.hasClass('template-collection') || Body.hasClass('template-product') || Body.hasClass('template-404')
            new QuickShopView()

        if $('.content-area').hasClass('customer')
            new AccountView({ el: @$el })



# ----------------------------------------------------- #
class IndexView extends Backbone.View

    initialize: ->
        setTimeout ( =>
            @verticallyAlign()
        ), 500

        Window.resize =>
            @verticallyAlign()
            
        new SlideshowView()
        
    verticallyAlign: ->
        for collection in ($ '.collection')
            labels = ($ collection).find('h2')
            for label in labels
                ($ label)
                    .css(marginTop: ($ label).height() / -2)
                    .removeClass('preload')



# ----------------------------------------------------- #
class RTEView extends Backbone.View

    events:
        'click .rte .tabs li' : 'switchTabs'

    initialize: ->
        @content = ($ '.rte')

        @setupTabs()
        @setupImages()
        @setupVideos()

        Window.resize =>
            @setupVideos()

    setupImages: ->
        images = @content.find('p > img')
        images.imagesLoaded ->
            for image in images
                image = ($ image)
                image.wrap('<div class="image-wrap">')

    setupVideos: ->
        videos          = @content.not(".special").find('iframe, embed, object')
        contentWidth    = @content.width()

        for video in videos
            video = ($ video)
            aspectRatio = (video.height() / video.width())
            video.css
                width: contentWidth
                height: contentWidth * aspectRatio
                visibility: 'visible'

    switchTabs: (e) ->
        tab                 = ($ e.currentTarget)
        tabContainer        = tab.parent()
        tabContentContainer = tabContainer.next()
        position            = tab.index()
        content             = tabContentContainer.find('li').eq(position)

        tabContainer.find('> li').removeClass('active')
        tabContentContainer.find('> li').removeClass('active')

        tab.addClass('active')
        content.addClass('active')

        # We have to re-format videos exclusive to the tabs being opened 
        # in the event that resizing occured while it was hidden.
        videos          = content.find('iframe, embed, object')
        contentWidth    = content.width()

        for video in videos
            video = ($ video)
            aspectRatio = (video.height() / video.width())
            video.css
                width: contentWidth
                height: contentWidth * aspectRatio
                visibility: 'visible'



        false

    setupTabs: ->
        RTEAreas = $('.rte')
        for RTEArea in RTEAreas
            RTEArea = ($ RTEArea)
            tabs    = RTEArea.find('.tabs')
            
            if RTEArea.find(':first-child').hasClass('tabs')
                RTEArea.parent().addClass('no-border')

            tabs.find('li:first').addClass('active')
            tabs.next().find('li:first').addClass('active')



# ----------------------------------------------------- #
class ProductView extends Backbone.View

    initialize: ->
        @productArea        = ($ '#product-area')
        @fullscreenViewer   = ($ '.fullscreen-product-viewer')
        @fullscreenModal    = @fullscreenViewer.find('.modal')
        @thumbsCount        = @productArea.find('.thumb').length

        @selectedThumbIndex = 0

        @setupVariants()

        @productArea.find('.showcase .container').spin('small')
        @fullscreenViewer.find('.showcase .container').spin('small')

        Window.resize =>
            @resize()

    events:
        'click #product-area .thumb'                : 'determineSelectedThumb'
        'click .modal-wrap .thumb'                  : 'determineSelectedThumb'
        'click .toggle-fullview'                    : 'openFullview'
        'click .fullscreen-product-viewer'          : 'closeFullview'
        'click .fullscreen-product-viewer .modal'   : 'stopProp'
        'click .submit.disabled'                    : 'disableSubmit'
        'click .modal-wrap .close'                  : 'closeFullview'

    resize: ->
        @formatTheModal()
        @resizeShowcase()

    stopProp: (e) ->
        e.stopPropagation()

    disableSubmit: ->
        false

    setupVariants: ->
        labels = @productArea.find('.selector-wrapper > label')
        if labels.length > 1
            width =  0
            for label in labels
                width = ($ label).width() if ($ label).width() > width

            labels.width(width)

        @productArea.find('.single-option-selector').sexyDrop({ autoWidth: false })

    resizeShowcase: ->
        container   = @productArea.find('.container')
        imgHeight   = container.find('img').height()
        container.height(imgHeight)

    openFullview: (e) ->
        Body.css 'overflow' : 'hidden'
        @fullscreenViewer.show()
        @formatTheModal()

        if not $('html').hasClass('lt-ie9')
            @fullscreenViewer.fadeTo 200, 1, =>
                # Synchronize product showcases
                @parent = @fullscreenModal

                if @thumbsCount > 0
                    @updateProductShowcase()
        else
            # Synchronize product showcases
            @parent = @fullscreenModal

            if @thumbsCount > 0
                @updateProductShowcase()

        $(document).bind 'keyup', (e) => # Bind the close function to the 'esc' key
            if e.keyCode is 27 then @closeFullview()

        false

    closeFullview: (e) ->
        if !e? or e.target is e.currentTarget

            if not $('html').hasClass('lt-ie9')
                @fullscreenViewer.fadeTo 200, 0, =>
                    # Synchronize product showcases
                    @parent = @productArea

                    if @thumbsCount > 0
                        @updateProductShowcase()

                    @fullscreenViewer.hide()
                    Body.css 'overflow' : 'auto'
            else
                # Synchronize product showcases
                @parent = @productArea

                if @thumbsCount > 0
                    @updateProductShowcase()

                @fullscreenViewer.hide()
                Body.css 'overflow' : 'auto'

            $(document).unbind 'keyup'

    formatTheModal: ->
        container = @fullscreenModal.find('.container')
        imgHeight = container.find('img').height()
        container.height(imgHeight)

        if Window.height() <= @fullscreenModal.outerHeight()
            @fullscreenModal.css 'margin-top' : 0
        else
            offset = (Window.height() - @fullscreenModal.outerHeight()) / 2
            @fullscreenModal.css 'margin-top' : offset

    determineSelectedThumb: (e) ->
        @selectedThumbIndex   = ($ e.currentTarget).index()
        @parent               = ($ e.currentTarget).parent().parent()
        @updateProductShowcase()

    updateProductShowcase: ->
        showcaseContainer   = @parent.find('.showcase .container')
        showcaseWrap        = showcaseContainer.find('.wrap')
        showcaseImage       = showcaseContainer.find('img')

        showcaseContainer.height(showcaseImage.height())

        activeThumb             = @parent.find('.thumb.active')
        selectedThumb           = @parent.find('.thumb').eq(@selectedThumbIndex)
        selectedImg             = selectedThumb.find('img')
        src                     = selectedImg.data('high-res-url')

        unless @selectedThumbIndex == activeThumb.index()

            img     = new Image()
            img.src = src
            img     = $(img)

            showcaseWrap.fadeTo 200,0, ->
                showcaseImage.remove()
                img.imagesLoaded ->
                    showcaseWrap.append(img)
                    showcaseContainer.animate
                            height: img.height()
                        , =>
                            activeThumb.removeClass('active')
                            selectedThumb.addClass('active')
                            showcaseWrap.fadeTo(200, 1)



# ----------------------------------------------------- #
class CartView extends Backbone.View

    events:
        'change .quantity .field' : 'updateQuantity'

    initialize: ->
        @textarea = ($ '.instructions textarea')
        @mobileInstructions = ($ '.mobile.instructions')
        @standardInstructions = ($ '.standard.instructions')

        $('.styled-select').sexyDrop()

        @breakpointFixes()
        Window.resize =>
            @breakpointFixes()

    breakpointFixes: ->
        if Window.width() < 720
            @mobileInstructions.append(@textarea)
        else
            @standardInstructions.append(@textarea)

    updateQuantity: (e) ->
        input       = ($ e.currentTarget)
        quantity    = input.val()
        id          = input.data('id')
        url         = "/cart/change/#{id}?quantity=#{quantity}"

        window.location = url



# ----------------------------------------------------- #
class ListCollectionsView extends Backbone.View

    initialize: ->
        setTimeout ( =>
            @verticallyAlign()
        ), 500

        Window.resize =>
            @verticallyAlign()

    verticallyAlign: ->
        for collection in ($ '.collection')
            labels = ($ collection).find('h2')
            for label in labels
                ($ label)
                    .css(marginTop: ($ label).height() / -2)
                    .removeClass('preload')



# ----------------------------------------------------- #
class CollectionView extends Backbone.View

    initialize: ->
        @titleContainer = ($ '.page-title')
        @title          = @titleContainer.find('.label')
        @tagsWrap       = ($ '.tags-wrap')
        @tags           = @tagsWrap.find('.tags')

        # Setup select
        ($ '.tags-dropdown').sexyDrop()

        @tagsWrap.removeClass('preload')

        @formatTags()
        Window.resize =>
            @formatTags()

    formatTags: ->
        dropdown            = @tagsWrap.find('.pxuSexyDropWrapper')   
        titleWidth          = @title.width()
        tagsWidth           = @tags.outerWidth(true)
        titleContainerWidth = @titleContainer.width()
        availableRoom       = titleContainerWidth - titleWidth

        if Window.width() >= 720
            if tagsWidth > availableRoom
                @tags.hide()
                dropdown.show()
            else
                @tags.show()
                dropdown.hide()
        else
            @tags.hide()
            dropdown.show()


# ----------------------------------------------------- #
class QuickShopView extends Backbone.View

    el: $('.quick-shop')

    events:
        'click'                             : 'close'
        'click .quick-shop-content .thumb'  : 'updateQuickShopShowcase'
        'click .submit:not(.disabled)'      : 'addToCart'

    initialize: ->
        @quickShop          = $('.quick-shop')
        @quickShopModal     = @quickShop.find('.quick-shop-modal')

        $('.product-inner .overlay').click (e)=>
            @open(e)

        @verticallyAlignTriggers()

        Window.resize =>
            @formatTheModal()
            @setupVideos()
            @verticallyAlignTriggers()

    verticallyAlignTriggers: ->
        for label in ($ '.product-inner .label')
            ($ label).css marginTop: ($ label).height() / -2

    formatTheModal: ->
        container = @quickShopModal.find('.container')
        imgHeight = container.find('img').height()
        container.height(imgHeight)

        if Window.height() <= $('.quick-shop-modal').outerHeight()
            @quickShopModal.css 'margin-top' : 0
        else
            offset = (Window.height() - $('.quick-shop-modal').outerHeight()) / 2
            @quickShopModal.css 'margin-top' : offset

    setupVideos: ->
        videos          = @quickShopModal.find('.rte iframe:visible, .rte embed:visible, .rte object:visible')
        contentWidth    = @quickShopModal.find('.rte').width()

        for video in videos
            video = ($ video)
            aspectRatio = (video.height() / video.width())
            video.css
                width: contentWidth
                height: contentWidth * aspectRatio
                visibility: 'visible'

    setupVariants: (quickShopContent) ->
        labels = quickShopContent.find('.selector-wrapper > label')
        width =  0
        for label in labels
            width = ($ label).width() if ($ label).width() > width

        labels.width(width)

        quickShopContent.find('.single-option-selector').sexyDrop({ autoWidth: false })
            
    open: (e) ->
        id                  = ($ e.currentTarget).data('id')
        quickShopContent    = $("#quick-shop-#{id}")

        Body.css 'overflow' : 'hidden'               # Locks the background
        @quickShop.show()                            # Display modal background
        @quickShopModal.append(quickShopContent)     # Append content from product item
        @setupVariants(quickShopContent)             # Style the dropdowns (cannot occur during display:none)   
        @formatTheModal()                            # Vertically / horizontally center and resize the modal
        @setupVideos()

        unless $('html').hasClass('lt-ie9')    
            @quickShop.fadeTo(200, 1)

        @quickShop.find('.showcase .container').spin('small')

        $(document).bind 'keyup', (e) => # Bind the close function to the 'esc' key
            if e.keyCode is 27 then @close()

    close: (e) ->

        if !e? or e.target is e.currentTarget

            submit           = @quickShopModal.find('.submit')
            quantity         = @quickShopModal.find('.product-quantity')
            quickShopContent = @quickShopModal.find('.quick-shop-content')
            id               = quickShopContent.attr('id').split('-')[2]

            $('.product-' + id).append(quickShopContent)

            if $('html').hasClass('lt-ie9')
                @quickShop.hide()
                @quickShopModal.html('')
                Body.css 'overflow' : 'auto'
                quantity.val('1')
            else
                @quickShop.fadeTo 200, 0, =>
                    @quickShop.hide()
                    @quickShopModal.html('')
                    Body.css 'overflow' : 'auto'
                    quantity.val('1')

            $(document).unbind 'keyup'

    updateQuickShopShowcase: (e) ->
        showcaseContainer   = @quickShop.find('.showcase .container')
        showcaseWrap        = showcaseContainer.find('.wrap')
        showcaseImage       = showcaseContainer.find('img')

        showcaseContainer.height(showcaseImage.height())

        activeThumb     = @quickShop.find('.pager .thumb.active')
        selectedThumb   = ($ e.currentTarget)
        selectedImg     = selectedThumb.find('img')
        src             = selectedImg.data('high-res-url')

        img     = new Image()
        img.src = src
        img     = $(img)
        img.removeAttr('height width')

        showcaseWrap.fadeTo 200,0, =>
            showcaseImage.remove()
            img.imagesLoaded ->
                showcaseWrap.append(img)
                showcaseContainer.animate
                        height: img.height()
                    , ->
                        activeThumb.removeClass('active')
                        selectedThumb.addClass('active')
                        showcaseWrap.fadeTo(200, 1)

    updateMiniCart: (data, Properties) ->
        Properties.price            = Shopify.formatMoney(data.line_price, Settings.currencyFormat)
        Properties.id               = data.id
        Properties.image            = data.image
        Properties.vendor           = data.vendor
        Properties.quantity.total   = data.quantity

        cartTotal       =     $('.mini-cart-wrap .item-count')
        existingItem    =     $("#item-#{Properties.id}")
        imageClass      =     if Settings.productImageBorders then 'overlay' else ''

        $('.mini-cart').removeClass('empty-cart')
        cartTotal.text(parseInt(cartTotal.text()) + parseInt(Properties.quantity.added))

        if existingItem.length > 0
            existingItem.find('.price').text(Properties.price)
            existingItem.find('.quantity .count').text(Properties.quantity.total)
        else

            item  =     $("<div class='item clearfix'>")

            html  =     "<div class='image-wrap'>"
            html +=         "<img src='#{Properties.image}'>"
            html +=         "<a class='#{imageClass}' href='#{Properties.product.url}'></a>"
            html +=     "</div>"
            html +=     "<div class='details'>"
            html +=         "<p class='brand'>#{Properties.vendor}</p>"
            html +=         "<p class='title'>"
            html +=             "<a href='#{Properties.product.url}'>#{Properties.product.title}</a>"
            html +=             "<span class='quantity'>× #{Properties.quantity.total}</span>"
            html +=         "</p>"
            html +=         "<p class='price'>#{Properties.price}</p>"
            html +=         "<p class='variant'>#{Properties.variant.title}</p>"
            html +=     "</div>"

            $('.mini-cart-items-wrap').append(item.html(html))

    addToCart: ->
        variantTitle = ''
        variantSelectors = @quickShop.find('.single-option-selector')
        for selector in variantSelectors
            selector = ($ selector)
            variantTitle += selector.val() + " / "

        variantTitle = variantTitle.substring(0, variantTitle.length - 3)

        Properties                  = {}
        Properties.variant          = {}
        Properties.product          = {}
        Properties.quantity         = {}
        Properties.quantity.added   = @quickShop.find('.product-quantity').val()
        Properties.variant.id       = @quickShop.find('.product-select').val()
        Properties.variant.title    = @quickShop.find('.product-select').data('variant-title') || variantTitle
        Properties.product.title    = @quickShop.find('.title').text()
        Properties.product.url      = @quickShop.find('.title a').attr('href')

        postToCartUrl = "/cart/add.js?quantity=#{Properties.quantity.added}&id=#{Properties.variant.id}"
        
        button = @quickShop.find('.submit')
        button.data('original-text', button.text())
        button.text('Please wait').addClass('disabled')

        $.ajax
            type:   'POST'
            dataType: 'json'
            url:    postToCartUrl
            error: (data, status, error) ->
                button.text('An error has occured')
                Settings.cartError.data     = data
                Settings.cartError.status   = status
                Settings.cartError.error    = error
            success: (data) =>
                button.text('Added to cart')
                @updateMiniCart(data, Properties)



# ----------------------------------------------------- #
class AccountView extends Backbone.View

    events: ->
        'click .guest-login a' : 'submitGuestCheckout'

    initialize: ->
        $('.styled-select').sexyDrop
            autoWidth: false
            verticallyAlign: false

    submitGuestCheckout: ->
        $('#customer_login_guest').submit()
        false


# ----------------------------------------------------- #
class SlideshowView extends Backbone.View

    el: $('.slideshow')

    initialize: ->
        @slideshow      = $('.slideshow')
        @slides         = @slideshow.find('.slide')
        @jumpLinksWrap  = ($ '.jump-to-slide')
        @setup()

        Window.resize =>
            @slideshow.css
                height : (@slides.filter('.active').height())

    events:
        'click .next' : 'rotate'
        'click .prev' : 'rotate'
        'click .jump-to-slide li:not(.active)' : 'rotate'

    setup: ->
        @slides.first().addClass('first')
        @slides.last().addClass('last')

        for _slide, i in @slides
            do =>
                slide = _slide

                if Settings.slideshowPagination and @slides.length > 0
                    @jumpLinksWrap.append $('<li>')

                if i is 0
                    slide = ($ slide)
                    slide.imagesLoaded ->
                        slide.fadeTo '200', 1, ->
                            height = slide.height()
                            slide.css('z-index', 2000).addClass('active')
                            slide.parent().css('height', height)

        @jumpLinks = @jumpLinksWrap.find('li')
        @jumpLinksWrap.find('li:first').addClass('active')

        if @slides.length is 1
            @slideshow.find('.next, .prev, .jump-to-slide').remove()
                

    rotate: (e) ->
        direction               = ($ e.currentTarget).attr('class')
        currentSlide            = @$el.find('.slide.active')
        currentSlidePosition    = currentSlide.eq()
        jumpPosition            = ($ e.currentTarget).index()
        isFirst                 = currentSlide.hasClass('first')
        isLast                  = currentSlide.hasClass('last')
        fadeSpeed               = 400

        # Estabilsh upcoming slide
        if direction is 'next'
            upcomingSlide = if isLast then @slides.first() else currentSlide.next()
        else if direction is 'prev'
            upcomingSlide = if isFirst then @slides.last() else currentSlide.prev()
        else
            upcomingSlide = @slides.eq(jumpPosition)

        upcomingSlidePosition = upcomingSlide.index()

        # Update jumpLinks
        for jumpLinksWrap in @jumpLinksWrap
            jumpLinksWrap    = ($ jumpLinksWrap)
            jumpLinks        = jumpLinksWrap.find('li')
            upcomingJumpLink = jumpLinks.eq(upcomingSlidePosition)
            currentJumpLink  = jumpLinks.filter('.active')

            currentJumpLink.removeClass('active')
            upcomingJumpLink.addClass('active')


        # Adjust slideshow height
        @slideshow.css 'height' : upcomingSlide.height()

        # Fire away!
        currentSlide.fadeTo fadeSpeed, 0, ->
            currentSlide.removeClass('active')
        upcomingSlide.fadeTo fadeSpeed, 1, =>
            upcomingSlide.addClass('active')
