# Python 3.7의 새로운 기능들

> [Cool New Features in Python 3.7](https://realpython.com/python37-new-features/)을 번역한 글입니다.

---

[[toc]]

---

Python 3.7이 [공식적으로 릴리스](https://www.python.org/downloads/release/python-370/) 되었습니다. 이 버전은 [2016년 9월](https://www.python.org/dev/peps/pep-0537/)부터 개발되어 왔으며 핵심 개발자들의 노력으로 드디어 사용할 수 있게 되었습니다.

새로운 버전에선 어떤 것들이 바뀌었을까요? [Python 3.7 문서](https://docs.python.org/3.7/whatsnew/3.7.html)에서 새로운 기능들을 살펴볼 수도 있지만, 이 포스트에서는 주목할만한 변경점들에 대해서 좀 더 자세히 다뤄보고자 합니다.

이 포스트에서 다룰 내용은 다음과 같습니다.

- 새로운 breakpoint() 내장 함수를 통한 좀 더 수월한 디버깅
- 데이터 클래스(dataclass)를 사용한 간편한 클래스 생성
- 모듈 속성 접근 커스터마이징
- 향상된 타입 힌팅 지원
- 고정밀 시간 함수

더 중요한 건 Python3.7은 빠르다는 것입니다.

Python 3.7의 속도에 대해서도 마지막 섹션에서 살펴볼 것입니다. 새로운 버전으로의 업그레이드에 대한 여러 조언을 얻을 수 있을 것입니다.

## breakpoint() 내장 함수 지원

개발자들은 완벽한 코드를 작성하려고 노력하지만, 진실은 결코 완벽한 코드를 작성할 수는 없다는 것입니다. 디버깅은 프로그래밍의 중요한 부분입니다. Python 3.7에는 breakpoint()라는 새로운 내장 함수가 들어왔습니다. 이 함수는 Python에 새로운 기능을 제공하지는 않지만 디버거를 좀 더 유연하고 직관적으로 사용할 수 있게 해줍니다.

여러분이 `bugs.py` 파일에 다음과 같은 버그를 유발하는 코드를 작성했다고 가정해봅시다.

```python
def divide(e, f):
    return f / e

a, b = 0, 1
print(divide(a, b))
```

코드를 실행하면 `divide()` 함수에서 `ZeroDivisionError` 익셉션이 발생할 것입니다. 여러분은 디버깅을 위해  `divide()` 최상단에 [디버거](https://realpython.com/python-debugging-pdb/)를 위치시켜 코드를 인터럽트하고 싶을겁니다. 코드에 소위 "중단점(breakpoint)"이라고 하는걸 설정하면 코드를 인터럽트 할 수 있습니다.

```python
def divide(e, f):
    # 중단점 삽입 지점
    return f / e
```

중단점은 프로그램의 현재 상태를 확인할 수 있도록 실행을 일시적으로 중단해야하는 코드 내의 신호입니다. 중단점은 어떻게 설정할 수 있을까요? Python 3.6 이하에서는 다음과 같이 설정할 수 있습니다.

```python
def divide(e, f):
    import pdb; pdb.set_trace()
    return f / e
```

[pdb](https://docs.python.org/library/pdb.html)는 표준 라이브러리의 Python 디버거입니다. Python 3.7에서는 새로운 `breakpoint()` 함수를 호출함으로써 위 명령문을 단축할 수 있습니다.

```python
def divide(e, f):
    breakpoint()
    return f / e
```

백그라운드에서, `breakpoint()`는 먼저 `pdb`를 임포트한 뒤 `pub.set_trace()`를 호출합니다. 가시적인 이점은 `breakpoint()`가 `import pdb; pdb.set_trace()`보다 더 기억하기 쉬우며 27자 대신 12자만 작성하면 된다는 것입니다. 하지만, `breakpoint()`을 사용함으로써 얻을 수 있는 실질적인 이점은 커스터마이징 기능입니다.

`breakpoint()`가 작성된 `bugs.py` 스크립트를 실행해봅시다.

```
$ python3.7 bugs.py
> /home/gahjelle/bugs.py(3)divide()
-> return f / e
(Pdb)
```

스크립트는 `breakpoint()`를 만나면 실행이 중단되고 PDB 디버깅 세션에 진입할 것입니다. `c`를 입력하고 엔터를 누르면 스크립트를 계속 진행할 수 있습니다. PDB와 디버깅에 대해 좀 더 자세히 알고싶다면 [Nathan Jennings의 PDB 가이드](https://realpython.com/python-debugging-pdb/)를 참고하세요.

이제 여러분이 버그를 고쳤다고 생각한다고 해봅시다. 그럼 이제 여러분은 디버거에서의 중단 없이 코드를 실행하고 싶을겁니다. 그냥 `breakpoint()` 라인을 주석처리 해버려도 되지만 `PYTHONBREAKPOINT` 환경 변수를 사용할 수도 있습니다. 이 변수는 `breakpoint()`의 동작을 제어하는데 `PYTHONBREAKPOINT=0`으로 설정하면 모든 `breakpoint()` 호출이 무시됩니다.

```
$ PYTHONBREAKPOINT=0 python3.7 bugs.py
ZeroDivisionError: division by zero
```

버그가 안고쳐진 것 같습니다 ..

또 다른 옵션은 `PYTHONBREAKPOINT`를 사용해 PDB 외의 디버거를 지정하는 것입니다. 예를 들어, [PuDB (콘솔 시각화 디버거)](https://pypi.org/project/pudb/)를 사용하려면 다음과 같이 설정하면 됩니다.

```
$ PYTHONBREAKPOINT=pudb.set_trace python3.7 bugs.py
```

위 명령어가 동작하려면 `pudb`가 이미 설치되어 있어야합니다. Python이 알아서 `pudb`를 임포트합니다. 이 방법으로 기본 디버거를 설정할 수 있는데 `PYTHONBREAKPOINT` 환경 변수를 원하는 디버거로 설정해두면 됩니다. 여러분의 시스템에 맞는 환경 변수를 설정하는 방법은 [이 가이드](https://www.schrodinger.com/kb/1842)를 참고하세요.

새로운 `breakpoint()` 함수는 디버거에서만 동작하지는 않습니다. 한 가지 편리한 옵션은 코드 내에서 대화형 셸을 시작하는 것입니다. 예를 들어, IPython 세션을 시작하려면 다음과 같이 설정하면 됩니다.

```
$ PYTHONBREAKPOINT=IPython.embed python3.7 bugs.py
IPython 6.3.1 -- An enhanced Interactive Python. Type '?' for help.

In [1]: print(e / f)
0.0
```

또한 자체 함수를 만들어 `breakpoint()`에서 호출되도록 할수도 있습니다. 다음 코드는 지역 스코프의 모든 변수들을 출력합니다. 이 코드를 `bp_utils.py` 파일에 추가해봅시다.

```python
from pprint import pprint
import sys

def print_locals():
    caller = sys._getframe(1)  # 호출자 (Caller)는 한 프레임 위에 있습니다.
    pprint(caller.f_locals)
```

이 함수를 사용하려면 `<module>.<function>` 표기법을 사용해 `PYTHONBREAKPOINT`를 이전과 같이 설정하면 됩니다.

```
$ PYTHONBREAKPOINT=bp_utils.print_locals python3.7 bugs.py 
{'e': 0, 'f': 1}
ZeroDivisionError: division by zero
```

일반적으로 `breakpoint()`는 인자가 필요없는 함수와 메서드를 호출하는데 사용되지만, 인자를 전달할 수도 있습니다. `bugs.py`의 `breakpoint()`를 다음과 같이 수정해봅시다.

```python
breakpoint(e, f, end="<-END\n")
```

::: tip

**Note:** `pdb.set_trace()`는 위치 인자를 받지 않기 때문에 기본 PDB 디버거는 위 라인에서 `TypeError`를 발생시킵니다.

:::

`print()` 함수로 가장한 `breakpoint()`를 사용해 이 코드를 실행하면 인자가 전달되는 간단한 예시를 볼 수 있습니다.

```
$ PYTHONBREAKPOINT=print python3.7 bugs.py 
0 1<-END
ZeroDivisionError: division by zero
```

이 함수에 대한 자세한 내용은 [PEP 553](https://www.python.org/dev/peps/pep-0553/)과 [breakpoint()](https://docs.python.org/3.7/library/functions.html#breakpoint) 및 [sys.breakpointhook()](https://docs.python.org/3.7/library/sys.html#sys.breakpointhook) 문서를 참고하세요.

## 데이터 클래스 (dataclass)

새로운 [데이터 클래스 (dataclasses)](https://docs.python.org/3.7/library/dataclasses.html) 모듈은 `.__init__()` , `.__repr__()` 및 `.__eq__()`와 같은 특수 메서드를 자동으로 추가함으로써 클래스를 보다 더 편리하게 작성할 수 있도록 해줍니다. `@dataclass` 데코레이터를 사용해 다음과 같이 작성할 수 있습니다.

```python
from dataclasses import dataclass, field

@dataclass(order=True)
class Country:
    name: str
    population: int
    area: float = field(repr=False, compare=False)
    coastline: float = 0

    def beach_per_person(self):
        """Meters of coastline per person"""
        return (self.coastline * 1000) / self.population
```

이 9줄의 코드는 많은 보일러 플레이트 코드와 모범 사례를 보여주고 있습니다. 이 `Country` 클래스를 일반 클래스로 구현하려면 어떤 것들이 필요할지 생각해봅시다. `__init__()` 메서드, `repr`, 6개의 비교 메서드 및 `.beach_per_person()` 메서드가 필요합니다. 데이터 클래스로 구현한 `Country` 클래스를 일반 클래스로 구현하면 다음과 같습니다.

```python
class Country:

    def __init__(self, name, population, area, coastline=0):
        self.name = name
        self.population = population
        self.area = area
        self.coastline = coastline

    def __repr__(self):
        return (
            f"Country(name={self.name!r}, population={self.population!r},"
            f" coastline={self.coastline!r})"
        )

    def __eq__(self, other):
        if other.__class__ is self.__class__:
            return (
                (self.name, self.population, self.coastline)
                == (other.name, other.population, other.coastline)
            )
        return NotImplemented

    def __ne__(self, other):
        if other.__class__ is self.__class__:
            return (
                (self.name, self.population, self.coastline)
                != (other.name, other.population, other.coastline)
            )
        return NotImplemented

    def __lt__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) < (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def __le__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) <= (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def __gt__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) > (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def __ge__(self, other):
        if other.__class__ is self.__class__:
            return ((self.name, self.population, self.coastline) >= (
                other.name, other.population, other.coastline
            ))
        return NotImplemented

    def beach_per_person(self):
        """Meters of coastline per person"""
        return (self.coastline * 1000) / self.population
```

클래스가 생성되면 데이터 클래스는 일반 클래스가 됩니다. 따라서 데이터 클래스도 일반 클래스처럼 상속할 수 있습니다. 데이터 클래스의 주목적은 강력한 클래스, 특히 주로 데이터를 저장하는 작은 클래스를 쉽고 빠르게 작성하는 것입니다.

`Country` 데이터 클래스는 다른 클래스와 같은 방식으로 사용할 수 있습니다.

```python
>>> norway = Country("Norway", 5320045, 323802, 58133)
>>> norway
Country(name='Norway', population=5320045, coastline=58133)

>>> norway.area
323802

>>> usa = Country("United States", 326625791, 9833517, 19924)
>>> nepal = Country("Nepal", 29384297, 147181)
>>> nepal
Country(name='Nepal', population=29384297, coastline=0)

>>> usa.beach_per_person()
0.06099946957342386

>>> norway.beach_per_person()
10.927163210085629
```

모든 필드 `.name`, `.population`, `.area` 및 `.coastline`은 클래스를 초기화 할 때 사용됩니다. (물론 `.coastline`은 옵션입니다) `Country` 클래스는 자동으로 생성된 적절한 [repr](https://dbader.org/blog/python-repr-vs-str)을 가지고 있지만 다른 메서드 정의들은 일반 클래스에서와 동일하게 동작합니다.

기본적으로 데이터 클래스는 대등 비교가 가능합니다. `@dataclass` 데코레이터에 `order=True`를 지정했기 때문에 `Country` 클래스는 정렬 또한 가능합니다.

```python
>>> norway == norway
True

>>> nepal == usa
False

>>> sorted((norway, usa, nepal))
[Country(name='Nepal', population=29384297, coastline=0),
 Country(name='Norway', population=5320045, coastline=58133),
 Country(name='United States', population=326625791, coastline=19924)]
```

정렬은 필드값을 기준으로 이루어지며 `.name`, `.population` 등의 순서로 비교가 수행됩니다. 그러나, `field()`를 사용하면 비교할 필드를 [직접 정의](https://realpython.com/python-data-classes/#advanced-default-values)할 수 있습니다. 이 예제에서 `.area` 필드는 `repr`과 비교에서 제외되었습니다.

데이터 클래스는 [namedtuple](https://dbader.org/blog/writing-clean-python-with-namedtuples)과 일부 동일한 작업을 수행합니다. 하지만 데이터 클래스는 [attrs 프로젝트](http://www.attrs.org/)에서 가장 많은 영향을 받았습니다. 더 많은 예제와 자세한 내용은 [데이터 클래스에 대한 완벽 가이드](https://realpython.com/python-data-classes/)와 공식 문서인 [PEP 557](https://www.python.org/dev/peps/pep-0557/)를 참고하세요.


## 모듈 속성 커스터마이징



## 향상된 타이핑

타입 힌팅과 어노테이션은 Python 3 릴리스 전체에서 꾸준히 개발되어 왔습니다.
파이썬의 [타이핑 시스템](https://www.youtube.com/watch?v=2xWhaALHTvU)은 이제 꽤 안정적입니다.
그럼에도 불구하고 Python 3.7은 성능 향상, 코어 지원 및 전방 참조(forward references)와 같은 몇 가지 개선 사항을 제공합니다.

파이썬은 런타임 시에 (명시적으로 [enforce](https://pypi.org/project/enforce/)와 같은 패키지를 사용하지 않는 한) 타입 검사를 하지 않습니다.
따라서 코드에 타입 힌트를 추가해도 성능에는 영향을 미치지 않습니다.

불행히도, 대부분의 타입 힌트가 `typing` 모듈을 필요로 하기 때문에 성능에 100% 영향이 없지는 않습니다.
`typing` 모듈은 표준 라이브러리에서 [가장 느린 모듈](https://www.python.org/dev/peps/pep-0560/#performance) 중 하나입니다.
[PEP 560](https://www.python.org/dev/peps/pep-0560/)은 `typing` 모듈의 속도를 대폭 향상시키는 Python 3.7에서 타이핑에 대한 코어 지원을 추가합니다.
이것에 대한 세부 사항은 일반적으로 알 필요가 없습니다. 느긋하게 누워서 향상된 성능을 즐기세요.

파이썬의 타입 시스템은 합리적인 표현력을 지녔지만, 약간의 고통을 주는 한 가지 문제는 전방 참조(forward references)입니다.
타입 힌트(또는 일반적으로 어노테이션)는 모듈을 가져오는 동안 평가됩니다.
따라서 모든 이름은 사용되기 전에 정의되어 있어야합니다.
따라서 다음은 불가능합니다:

```python
class Tree:
    def __init__(self, left: Tree, right: Tree) -> None:
        self.left = left
        self.right = right
```

클래스 `Tree`가 `.__init__()` 메서드에서 아직 (완전히) 정의되지 않았으므로 코드를 실행하면 `NameError`가 발생합니다.

```python
Traceback (most recent call last):
  File "tree.py", line 1, in <module>
    class Tree:
  File "tree.py", line 2, in Tree
    def __init__(self, left: Tree, right: Tree) -> None:
NameError: name 'Tree' is not defined
```

이를 해결하기 위해서는 문자열 리터럴 `"Tree"`를 사용해야합니다.

```python
class Tree:
    def __init__(self, left: "Tree", right: "Tree") -> None:
        self.left = left
        self.right = right
```

전방 참조에 대한 논의는 [PEP 484](https://www.python.org/dev/peps/pep-0484/#forward-references)를 참고하세요.

추후에 [Python 4.0](http://www.curiousefficiency.org/posts/2014/08/python-4000.html)에서는 전방 참조(forward references)가 허용될 것입니다.
이는 참조가 명시적으로 요구되기 전까진 어노테이션을 평가하지 않음으로써 처리됩니다.
이 제안의 자세한 내용은 [PEP 563](https://www.python.org/dev/peps/pep-0563/)에 기술되어 있습니다.
Python 3.7에서는 이미 [__future__](https://docs.python.org/3/library/__future__.html)를 통해 전방 참조를 사용할 수 있습니다.
이제 다음과 같이 작성할 수 있습니다:

```python
from __future__ import annotations

class Tree:
    def __init__(self, left: Tree, right: Tree) -> None:
        self.left = left
        self.right = right
```

지연된 어노테이션을 사용함으로써 다소 불명확한 `"Tree"` 구문을 피하고 타입 힌트도 실행하지 않기 때문에 코드 속도 또한 빨라집니다.
전방 참조(forward references)는 이미 [mypy](http://mypy-lang.org/)에서 지원되고 있습니다.

지금까지 어노테이션의 가장 일반적인 사용처는 타입 힌팅입니다.
그럼에도 불구하고 런타임 시에 어노테이션에 대한 모든 액세스 권한을 가지며 적절하게 사용할 수 있습니다.
어노테이션을 직접 처리하는 경우 가능한 전방 참조를 명시적으로 처리해야합니다.

어노테이션이 평가될 때 표시되는 나쁜 예제를 만들어 보겠습니다.
먼저 기존 방식을 사용하면 어노테이션은 가져오는 시점에 평가됩니다.
`anno.py`에 다음 코드를 작성해보세요:

```python
def greet(name: print("Now!")):
    print(f"Hello {name}")
```

`name`의 어노테이션은 `print()`입니다.
이는 어노테이션이 평가되는 시점을 정확하게 볼 수 있는 유일한 방법입니다.
새 모듈을 가져와보세요:

```python
>>> import anno
Now!

>>> anno.greet.__annotations__
{'name': None}

>>> anno.greet("Alice")
Hello Alice
```

보시다시피, 어노테이션은 임포트 시점에 평가되었습니다.
그 다음 `name`은 `print()`의 반환값인 `None`으로 어노테이트됩니다.
지연된 어노테이션 평가를 사용하려면 `__future__`를 `import` 하세요.

```python
from __future__ import annotations

def greet(name: print("Now!")):
    print(f"Hello {name}")
```

이 수정된 코드를 임포트하면 어노테이션을 평가되지 않습니다.

```python
>>> import anno

>>> anno.greet.__annotations__
{'name': "print('Now!')"}

>>> anno.greet("Marty")
Hello Marty
```

`Now!`는 출력되지 않았고, 어노테이션은 `__annotations__` 딕셔너리에 문자열 리터럴로 보관됩니다 남아 있음에 주목하세요.
어노테이션을 평가하려면 `typing.get_type_hints()` 또는 `eval()`을 사용하세요.

```python
>>> import typing
>>> typing.get_type_hints(anno.greet)
Now!
{'name': <class 'NoneType'>}

>>> eval(anno.greet.__annotations__["name"])
Now!

>>> anno.greet.__annotations__
{'name': "print('Now!')"}
```

`__annotations__` 딕셔너리는 절대로 수정되지 않으므로 어노테이션을 사용할 때마다 평가해야합니다.


## 시간 정밀도
Python 3.7에서는 [PEP 564](https://www.python.org/dev/peps/pep-0564/)에 설명된 [time](https://docs.python.org/3/library/time.html) 모듈의 새로운 함수가 있습니다.

주목할만한 6개의 함수를 소개합니다.

- **clock_gettime_ns() :** 지정된 클럭의 시간 값을 반환합니다.
- **clock_settime_ns() :** 지정된 클럭의 시간 값을 설정합니다.
- **monotinic_ns() :** 거꾸로 돌릴 수 없는(가령, 서머타임 때문에 시간이 앞당겨지는 경우가 있음) 단조 증가 클럭의 시간을 나노초 단위로 반환합니다.
- **perf_counter_ns() :** 퍼포먼스 카운터의 값을 반환합니다. 클럭은 특별히 짧은 시간을 측정하기 위해 고안되었습니다.
- **process_time_ns() :** 현재 프로세스(sleep 시간은 포함하지 않습니다.)의 시스템 및 유저 CPU 시간의 합을 나노초 단위로 반환합니다.
- **time_ns() :** 1970년 1월 1일부터 현재까지의 시간을 나노초 단위로 반환합니다.

어떤 의미에서는 딱히 새로울 게 없습니다.
각 함수는 접미사 `_ns`가 없는 기존의 함수들과 비슷합니다.
차이점으로 기존 함수는 초 단위를 `float`형으로 리턴하지만, 새 함수는 나노초 단위를 `int`형으로 반환합니다.
대부분의 어플리케이션에서는 새로운 나노초 함수와 기존 시간 관련 함수의 차이가 와닿지 않을 수 있습니다.
그러나 새 함수는 `float`형 대신 `int`형을 사용하기 때문에 더 쉽게 다룰 수 있습니다.
부동 소수점(Floating point) 숫자들은 [태생적으로 부정확](https://docs.python.org/3/tutorial/floatingpoint.html)합니다.

```python
>>> 0.1 + 0.1 + 0.1
0.30000000000000004

>>> 0.1 + 0.1 + 0.1 == 0.3
False
```

이것은 Python의 문제가 아니라 컴퓨터가 유한한 비트 수를 사용해 무한 소수를 표현하는 과정에서 오는 결과입니다.
Python의 `float`형은 [IEEE 754 표준](https://en.wikipedia.org/wiki/IEEE_754)을 따르고 53개의 유효비트를 사용합니다.
104일보다 많은 시간(2의 53승 혹은 [9000조 나노초](https://en.wikipedia.org/wiki/Names_of_large_numbers)은 `float`형으로 나노초의 정밀도를 표현할 수 없습니다.
그에 반해 Python의 `int`형 숫자는 시간값과 무관하게 나노초의 정밀도를 가집니다.

예시와 같이 `time.time()`은 1970년 1월 1일부터 흐른 시간을 초 단위로 반환합니다.
이 숫자는 꽤 크며 정확성은 마이크로초 수준입니다.
이 함수는 `_ns` 버전에서 엄청난 개선을 이뤄냈습니다.
`time.time_ns()`의 해상도는 `time.time()`보다 [약 3배 이상](https://www.python.org/dev/peps/pep-0564/#analysis) 향상되었습니다.

```tip
그런데 나노초가 뭔가요?
기술적으로는 10억분의 1 혹은 1e-9 초를 말합니다.
와닿는 숫자는 아닙니다.
더 나은 설명은 [Grace Hopper](https://en.wikipedia.org/wiki/Grace_Hopper#Anecdotes)의 [나노초 설명 영상](https://www.youtube.com/watch?v=JEpsKnWZrJ8)을 참조하세요.
```

여담으로, 나노초 정밀도의 시간을 다루는 경우 `datetime` 표준 라이브러리는 사용하기 어렵습니다.
`datetime`은 마이크로초 단위로만 작동하기 때문입니다.

```python
>>> from datetime import datetime, timedelta
>>> datetime(2018, 6, 27) + timedelta(seconds=1e-6)
datetime.datetime(2018, 6, 27, 0, 0, 0, 1)

>>> datetime(2018, 6, 27) + timedelta(seconds=1e-9)
datetime.datetime(2018, 6, 27, 0, 0)
```

대신 [`astropy` 프로젝트](http://www.astropy.org/)를 사용할 수 있습니다.
[`astropy.time`](http://docs.astropy.org/en/stable/time/) 패키지는 우주의 나이 이상의 시간을 두 개의 `float`형 객체를 사용하여 나노초 이하 정밀도로 datetime을 표현합니다.

```python
>>> from astropy.time import Time, TimeDelta
>>> Time("2018-06-27")
<Time object: scale='utc' format='iso' value=2018-06-27 00:00:00.000>

>>> t = Time("2018-06-27") + TimeDelta(1e-9, format="sec")
>>> (t - Time("2018-06-27")).sec
9.976020010071807e-10
```

`astropy`의 마지막 버전은 Python 3.5 이후 버전에서 사용 가능합니다.

## 기타 멋진 기능들



### 딕셔너리 순서 보장



### "async" 및 "await" 키워드 추가



### 새로워진 "asyncio"



### 컨텍스트 변수

컨텍스트 변수는 컨텍스트에 따라 다른 값을 가질 수 있는 변수입니다.
이들은 각 실행 스레드가 같은 변수에 대해 서로 다른 값을 가질 수 있는 스레드-로컬 저장소(Thread-Local Storage)와 유사합니다.
그러나 컨텍스트 변수의 경우 하나의 실행 스레드에 여러 컨텍스트가 있을 수 있습니다.
컨텍스트 변수의 주요 사용 사례는 동시 비동기 작업에서 변수를 추적하는 것입니다.

다음 예제는 각각 `name` 값에 대한 자체 값을 가진 세 개의 컨텍스트를 구성합니다.
`greet()` 함수는 나중에 각 컨텍스트 내에서 `name` 값을 사용할 수 있습니다.

```python
import contextvars

name = contextvars.ContextVar("name")
contexts = list()

def greet():
    print(f"Hello {name.get()}")

# 컨텍스트를 구성하고 컨텍스트 변수명을 설정합니다
for first_name in ["Steve", "Dina", "Harry"]:
    ctx = contextvars.copy_context()
    ctx.run(name.set, first_name)
    contexts.append(ctx)

# 각 컨텍스트 내부에서 greet 함수를 실행합니다
for ctx in reversed(contexts):
    ctx.run(greet)
```

이 스크립트를 실행하면 Steve, Dina, Harry가 역순으로 출력됩니다.

### "Importlib.resources"로 데이터 파일 불러오기



### 개발자를 위한 트릭



### 최적화



## 그래서, 업그레이드를 해야하나요?