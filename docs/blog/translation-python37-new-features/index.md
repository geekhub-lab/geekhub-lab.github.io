# Python 3.7의 새로운 기능들

[[toc]]

## breakpoint() 내장함수 지원



## 데이터 클래스 (dataclass)



## 모듈 속성 커스터마이징



## 향상된 타이핑

타입 힌팅과 어노테이션은 Python 3 릴리즈 전체에서 꾸준히 개발되어 왔습니다.
파이썬의 [타이핑 시스템](https://www.youtube.com/watch?v=2xWhaALHTvU)은 이제 꽤 안정적입니다.
그럼에도 불구하고 Python 3.7은 성능 향상, 핵심 지원 및 전방 참조(forward references)와 같은 몇 가지 개선 사항을 제공합니다.

파이썬은 런타임 시에 (명시적으로 [enforce](https://pypi.org/project/enforce/)와 같은 패키지를 사용하지 않는 한) 타입 검사를 하지 않습니다.
따라서 코드에 타입 힌트를 추가해도 성능에 영향을 미치지 않습니다.

불행히도, 대부분의 타입 힌트가 `typing` 모듈을 필요로 하기 때문에 완전하지 않습니다.
`typing` 모듈은 표준 라이브러리에서 [가장 느린 모듈](https://www.python.org/dev/peps/pep-0560/#performance) 중 하나입니다.
[PEP 560](https://www.python.org/dev/peps/pep-0560/)은 `typing` 모듈의 속도를 대폭 향상시키는 Python 3.7에서 타이핑에 대한 핵심 지원을 추가합니다.
이것에 대한 세부 사항은 일반적으로 알 필요가 없습니다. 느긋하게 누워서 향상된 성능을 즐기세요.(TODO: 더 자연스러운 표현은 없을까)

파이썬의 타입 시스템은 합리적으로 표현력이 있지만, 약간의 고통을 주는 한 가지 문제는 전방 참조(forward references)입니다.
타입 힌트(또는 일반적으로 어노테이션)는 모듈을 가져 오는 동안 계산됩니다.
따라서 모든 이름은 사용되기 전에 정의되어 있어야합니다.
따라서 다음은 불가능합니다:

```python
class Tree:
    def __init__(self, left: Tree, right: Tree) -> None:
        self.left = left
        self.right = right
```

클래스 `Tree`가 `.__init__()` 메소드에서 아직 (완전히) 정의되지 않았으므로 코드를 실행하면 `NameError`가 발생합니다.

```python
Traceback (most recent call last):
  File "tree.py", line 1, in <module>
    class Tree:
  File "tree.py", line 2, in Tree
    def __init__(self, left: Tree, right: Tree) -> None:
NameError: name 'Tree' is not defined
```

이를 해결하기 위해 문자열 리터럴 `"Tree"`를 써야합니다.

```python
class Tree:
    def __init__(self, left: "Tree", right: "Tree") -> None:
        self.left = left
        self.right = right
```

원래 토론에 대해서는 [PEP 484](https://www.python.org/dev/peps/pep-0484/#forward-references)를 참조하세요.

미래의 [Python 4.0](http://www.curiousefficiency.org/posts/2014/08/python-4000.html)에서는 이와 같이 전방 참조(forward references)가 허용될 것입니다.
이는 명시적으로 요구될 때까지 어노테이션을 계산하지 않음으로써 처리됩니다.
[PEP 563](https://www.python.org/dev/peps/pep-0563/)은 이 제안의 세부 사항을 설명합니다.
Python 3.7에서 전방 참조는 이미 [__future__](https://docs.python.org/3/library/__future__.html)를 `import` 해서 사용 가능합니다.
이제 다음과 같이 작성할 수 있습니다:

```python
from __future__ import annotations

class Tree:
    def __init__(self, left: Tree, right: Tree) -> None:
        self.left = left
        self.right = right
```

다소 불명확한 `"Tree"` 구문을 피하는 것 외에도 타입 힌트 계산이 지연되지 않으므로 지연된 어노테이션 계산도 코드 속도를 높입니다.(TODO: 말이 너무 꼬인 느낌)
전방 참조(forward references)는 이미 [mypy](http://mypy-lang.org/)에서 지원합니다.

지금까지 어노테이션의 가장 일반적인 사용은 타입 힌팅입니다.
그럼에도 불구하고 런타임 시에 어노테이션에 대한 모든 액세스 권한을 가지며 적절하게 사용할 수 있습니다.
어노테이션을 직접 처리하는 경우 가능한 전방 참조를 명시적으로 처리해야합니다.

어노테이션이 계산될 때 표시되는 나쁜 예제를 만들어 보겠습니다.
먼저 오래된 방법으로 처리하므로 어노테이션을 가져올 때 계산됩니다.
`anno.py` 가 다음 코드를 포함하게 해보세요:

```python
def greet(name: print("Now!")):
    print(f"Hello {name}")
```

`name`의 어노테이션은 `print()`입니다.
이것은 어노테이션이 계산되는 시점을 정확하게 볼 수 있습니다.
새 모듈을 가져와보세요:

```python
>>> import anno
Now!

>>> anno.greet.__annotations__
{'name': None}

>>> anno.greet("Alice")
Hello Alice
```

보시다시피, 어노테이션을 가져올 때 계산되었습니다.
`print()`의 반환값이기 때문에 `name`은 `None`으로 어노테이트됩니다.
어노테이션의 지연된 계산을 사용하려면 `__future__`를 `import` 하세요.

```python
from __future__ import annotations

def greet(name: print("Now!")):
    print(f"Hello {name}")
```

이 업데이트된 코드를 가져오면 어노테이션을 계산하지 않습니다.

```python
>>> import anno

>>> anno.greet.__annotations__
{'name': "print('Now!')"}

>>> anno.greet("Marty")
Hello Marty
```

이제 유의하세요.
결코 `print` 되지 않으며 어노테이션은 `__annotations__` 딕셔너리에 문자열 리터럴로 보관됩니다.
어노테이션을 계산하려면 `typing.get_type_hints()` 또는 `eval()`을 사용하세요.

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

`__annotations__` 딕셔너리는 절대로 업데이트되지 않으므로 어노테이션을 사용할 때마다 계산해야합니다.


## 시간 정밀도



## 기타 멋진 기능들



### 딕셔너리 순서 보장



### "async" 및 "await" 키워드 추가



### 새로워진 "asyncio"



### 컨텍스트 변수

컨텍스트 변수는 컨텍스트에 따라 다른 값을 가질 수 있는 변수입니다.
이들은 각 실행 스레드가 변수에 대해 다른 값을 가질 수 있는 스레드-로컬 저장소(Thread-Local Storage)와 유사합니다.
그러나 컨텍스트 변수의 경우 하나의 실행 스레드에 여러 컨텍스트가 있을 수 있습니다.
컨텍스트 변수의 주요 사용 사례는 동시 비동기 작업에서 변수를 추적하는 것입니다.

다음 예제는 세 개의 컨텍스트를 구성하며 각 컨텍스트는 값 이름에 대한 자체 값을 가집니다.
`greet()` 함수는 나중에 각 컨텍스트 내에서 `name` 값을 사용할 수 있습니다.

```python
import contextvars

name = contextvars.ContextVar("name")
contexts = list()

def greet():
    print(f"Hello {name.get()}")

# 컨텍스트를 구성하고 컨텍스트 변수 이름을 설정합니다
for first_name in ["Steve", "Dina", "Harry"]:
    ctx = contextvars.copy_context()
    ctx.run(name.set, first_name)
    contexts.append(ctx)

# 각 함수 내부에서 greet 함수를 실행합니다
for ctx in reversed(contexts):
    ctx.run(greet)
```

이 스크립트를 실행하면 Steve, Dina, Harry 가 역순으로 출력됩니다.

### "Importlib.resources"로 데이터 파일 불러오기



### 개발자를 위한 트릭



### 최적화



## 그래서, 업그레이드를 해야하나요?