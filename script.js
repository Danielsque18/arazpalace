// Араз Палас — меню, подбор зала по числу гостей, отзывы, статус «открыто» (Тверь, UTC+3), отсчёт до Нового года.
(function () {
  var root = document.documentElement; root.classList.add('js');
  var $ = function (s) { return document.querySelector(s); };

  /* меню */
  var top = $('#top'), burger = top.querySelector('.burger');
  burger.addEventListener('click', function () { var o = top.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  top.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { top.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });

  /* подбор зала: подсвечиваем самый маленький зал, куда помещаются гости */
  var range = $('#guests'), num = $('#gNum'), res = $('#gRes'), halls = [].slice.call(document.querySelectorAll('.hall'));
  var names = { 200: 'Основной зал', 80: 'Синий зал', 40: 'Веранда', 12: 'Домики' };
  function pick() {
    var g = +range.value, best = null;
    num.textContent = g;
    halls.forEach(function (h) { var m = +h.dataset.max; if (m >= g && (!best || m < +best.dataset.max)) best = h; });
    halls.forEach(function (h) { h.classList.toggle('fit', h === best); h.classList.toggle('small', +h.dataset.max < g); });
    var others = halls.filter(function (h) { return h !== best && +h.dataset.max >= g; }).map(function (h) { return names[h.dataset.max]; });
    res.innerHTML = 'Вам подойдёт <b>' + names[best.dataset.max] + '</b>' + (others.length ? '. Поместитесь и в: ' + others.join(', ') + '.' : '.');
  }
  range.addEventListener('input', pick); pick();

  /* отзывы — дословно с Яндекс Карт, длинные сокращены «…» */
  var R = [
    ['Сергей Мерзляков', 'сентябрь 2026', 'Справляла Юбилей 5 сентября в Синем зале.Все остались в полном восторге.Ребята -официанты на высоте!Кухня отличная!Зал,шикарный!И спасибо администратору Марине.'],
    ['Игорь Смирнов', 'май 2026', 'Отличный ресторан, рекомендую. По меню всё вкусно, красивый зал, официанты очень отзывчивые улыбчивые 5баллов.'],
    ['Татьяна Иванова', 'апрель 2026', 'Отличная кухня и прекрасный персонал 👍 отмечали юбилей, гостям и нам все понравилось! Желаем процветания ресторану!'],
    ['Марья', 'февраль 2026', 'Из другого города приезжали на мероприятие в город Тверь и нам порекомендовали именно это заведение, блюда сумасшедшие 👍 это такой гастрономический экстаз , просто от А до Я … Ребята целую руки кто готовит 🔥вы лучшие ❤️'],
    ['Александра В.', 'июль 2026', 'Гостиница очень понравилась! Начиная от сотрудника, который нас заселил.Очень вежливая и приятная девушка. Заканчивая уютным, чистым номером☺'],
    ['Алексей Милов', 'февраль 2026', 'Большой выбор мясных блюд.Живая музыка.Большое пространство для мероприятий.Вкусный шашлык.Вежливый персонал.'],
    ['Ксения Н.', 'август 2025', 'Отличный отель, номера очень классно оформлены, пребывание было очень приятным! Внизу отличный ресторан с вкусной бюджетной кухней и восточным колоритом🔥 Рекомендую!'],
    ['Дмитрий Морозов', 'октябрь 2025', 'Отличная сауна по приемлемой цене, в сауне очень чисто, бассейн чистый и теплый, парная выше всяких похвал! …'],
    ['Ирина Брагина', 'сентябрь 2025', 'Отель понравился. Шума от проходящего мероприятия внизу слышно не было, как написано в некоторых отзывах. Останавливались в Люксе. … Спасибо за радушный приём']
  ];
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  $('#rvGrid').innerHTML = R.map(function (r) { return '<article class="rcard rv"><span class="stars" aria-label="5 звёзд">★★★★★</span><p>' + esc(r[2]) + '</p><cite>' + esc(r[0]) + '<small>Яндекс Карты · ' + r[1] + '</small></cite></article>'; }).join('');

  /* меню: вкладки по разделам, карточки блюд */
  (function () {
    var M = window.MENU || [], tabs = $('#mnTabs'), grid = $('#mnGrid');
    if (!M.length) return;
    tabs.innerHTML = M.map(function (c, i) { return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(c[0]) + '</button>'; }).join('');
    function show(i) {
      tabs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.i == i); });
      grid.innerHTML = M[i][1].map(function (d, k) { return '<article class="dish" style="animation-delay:' + (k % 8) * 0.04 + 's"><figure><img src="' + d[3] + '" alt="' + esc(d[0]) + '" loading="lazy" width="520" height="520"></figure><div class="dish-t"><h3>' + esc(d[0]) + '</h3><div class="dish-p"><b>' + d[2].toLocaleString('ru-RU') + ' ₽</b><span>' + esc(d[1]) + '</span></div></div></article>'; }).join('');
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i); });
    show(0);
  })();

  /* время Твери (UTC+3): статус и отсчёт до Нового года */
  function tver() { return new Date(Date.now() + (3 * 60 + new Date().getTimezoneOffset()) * 60000); }
  function tick() {
    var d = tver(), m = d.getHours() * 60 + d.getMinutes(), open = m >= 660;
    var el = $('#open'); el.classList.toggle('is-open', open); el.textContent = open ? 'Сейчас открыто, до 00:00' : 'Откроемся сегодня в 11:00';
    /* новогодний блок живёт с 1 октября по 31 декабря, в остальное время скрыт */
    $('#ny').hidden = d.getMonth() < 9;
    var ny = new Date(d.getFullYear() + 1, 0, 1), days = Math.ceil((ny - d) / 864e5);
    $('#nyYear').textContent = ny.getFullYear();
    var w = days % 10 === 1 && days % 100 !== 11 ? 'день' : days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20) ? 'дня' : 'дней';
    $('#nyDays').textContent = days + ' ' + w;
  }
  tick(); setInterval(tick, 60000);

  /* появление при прокрутке */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.hall, .g, .k-grid figure, .gift, .k-quote, .hotel-pic, .ticks li, .rcard, .big-quote, .map').forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  setTimeout(function () { document.querySelectorAll('.rv').forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }); }, 2500);
})();
